import { useState } from 'react';
import useTrackerStore from '../store/trackerStore';

function TrackerView({ tracker, onBack, onOpenMonthly, onOpenStats }) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'add' or 'delete'
  const [newTaskName, setNewTaskName] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState('');
  const storeActions = useTrackerStore();

  const getDaysOfWeek = () => ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const predefinedHabits = [
    '💧 Drink 8 glasses of water',
    '🏃‍♂️ Exercise for 30 minutes',
    '📚 Read for 20 minutes',
    '🧘‍♀️ Meditate for 10 minutes',
    '🌅 Wake up early',
    '📱 No phone before bed',
    '🥗 Eat healthy meals',
    '✍️ Write in journal',
    '🛌 Sleep 8 hours',
    '🚶‍♀️ Walk 10,000 steps',
    '🍎 Eat 5 fruits/vegetables',
    '💻 No social media for 1 hour'
  ];

  const getFilteredHabits = () => {
    return newTaskName.length === 0 
      ? predefinedHabits 
      : predefinedHabits.filter(habit =>
          habit.toLowerCase().includes(newTaskName.toLowerCase())
        );
  };

  const handleAddTask = () => {
    setDialogType('add');
    setShowTaskDialog(true);
    setNewTaskName('');
  };

  const handleDeleteTask = (taskIndex) => {
    setDialogType('delete');
    setTaskToDelete(taskIndex);
    setShowTaskDialog(true);
  };

  const confirmAddTask = () => {
    if (newTaskName.trim()) {
      // Check for duplicate tasks (case-insensitive)
      const taskExists = tracker.tasks.some(task => 
        task.toLowerCase().trim() === newTaskName.toLowerCase().trim()
      );
      
      if (taskExists) {
        setValidationError('This task already exists! Please choose a different task name.');
        return;
      }
      
      storeActions.addTaskToTracker(tracker.id, newTaskName.trim());
      setShowTaskDialog(false);
      setNewTaskName('');
      setShowSuggestions(false);
      setValidationError('');
    }
  };

  const confirmDeleteTask = () => {
    storeActions.removeTaskFromTracker(tracker.id, taskToDelete);
    setShowTaskDialog(false);
    setTaskToDelete(-1);
  };

  const cancelDialog = () => {
    setShowTaskDialog(false);
    setNewTaskName('');
    setTaskToDelete(-1);
    setShowSuggestions(false);
    setValidationError('');
  };

  const handleSuggestionClick = (habit) => {
    setNewTaskName(habit);
    setShowSuggestions(false);
    setValidationError(''); // Clear error when selecting suggestion
  };
  
  const getWeekDates = (weekIndex) => {
    const startDate = new Date(tracker.createdAt);
    
    // Find the Monday of the week when the tracker was created
    const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Calculate days to get to Monday
    
    const firstMonday = new Date(startDate);
    firstMonday.setDate(startDate.getDate() + daysToMonday);
    
    // Now calculate the Monday of the selected week
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (weekIndex * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleToggleTask = (date, taskIndex) => {
    storeActions.toggleTaskCompletion(tracker.id, date, taskIndex);
  };

  const checkTaskCompleted = (date, taskIndex) => {
    return storeActions.isTaskCompleted(tracker.id, date, taskIndex);
  };

  const getTasksCompletedForDay = (date) => {
    return storeActions.getCompletedTasksForDay(tracker.id, date);
  };

  const getTaskIcon = (task) => {
    // Check if task already has an emoji at the beginning
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}]|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}/u;
    if (emojiRegex.test(task)) {
      return ''; // Return empty string if task already has emoji
    }
    
    // Only add emoji if task doesn't have one
    const taskLower = task.toLowerCase();
    if (taskLower.includes('walk') || taskLower.includes('run')) return '🚶';
    if (taskLower.includes('yoga') || taskLower.includes('stretch')) return '🧘';
    if (taskLower.includes('swim')) return '🏊';
    if (taskLower.includes('water') || taskLower.includes('drink')) return '💧';
    if (taskLower.includes('read')) return '📚';
    if (taskLower.includes('meditat')) return '🧘';
    if (taskLower.includes('exercise') || taskLower.includes('workout')) return '💪';
    if (taskLower.includes('eat') || taskLower.includes('food')) return '🍎';
    if (taskLower.includes('sleep')) return '😴';
    if (taskLower.includes('stand')) return '🧍';
    if (taskLower.includes('calorie') || taskLower.includes('burn')) return '🔥';
    return '✨';
  };

  const getTaskStreak = (taskIndex) => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      if (checkTaskCompleted(currentDate, taskIndex)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const weekDates = getWeekDates(selectedWeek);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="tracker-view">
      <div className="tracker-view-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1 className="tracker-view-title">{tracker.title}</h1>
        <div className="view-switcher ">
          <button className="view-btn active">Weekly</button>
          <button className="view-btn" onClick={onOpenMonthly}>Monthly</button>
          <button className="view-btn" onClick={onOpenStats}>Stats</button>
        </div>
      </div>

      <div className="week-selector">
        <button
          onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
          disabled={selectedWeek === 0}
          className="week-nav-btn"
        >
          ←
        </button>
        <span className="week-info">
          Week {selectedWeek + 1} of {tracker.weeks}
        </span>
        <button
          onClick={() => setSelectedWeek(Math.min(tracker.weeks - 1, selectedWeek + 1))}
          disabled={selectedWeek === tracker.weeks - 1}
          className="week-nav-btn"
        >
          →
        </button>
      </div>

      <div className="tracker-grid-container">
        <div className="tracker-grid">
          <div className="grid-header">
            <div className="task-column-header">Tasks</div>
            {weekDates.map((date, index) => {
              const dayName = getDaysOfWeek()[index];
              const completed = getTasksCompletedForDay(date);
              const total = tracker.tasks.length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return (
                <div key={index} className="day-header">
                  <div className="day-name">{dayName}</div>
                  <div className="day-date">{date.getDate()}</div>
                  <div className="day-progress">{percentage}%</div>
                </div>
              );
            })}
            <div className="task-column-header" style={{ fontSize: '0.8rem' }}>Streak</div>
            </div>

          <div className="grid-body">
            {tracker.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="task-row">
                <div className="task-name">
                  <span className="habit-icon">{getTaskIcon(task)}</span>
                  <span className="task-title">{task}</span>
                  <button 
                    className="delete-task-btn"
                    onClick={() => handleDeleteTask(taskIndex)}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              {weekDates.map((date, dayIndex) => {
                const isCompleted = checkTaskCompleted(date, taskIndex);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
                const cellDate = new Date(date);
                cellDate.setHours(0, 0, 0, 0);
                
                const isToday = cellDate.getTime() === today.getTime();
                const isFutureDate = cellDate > today;
                
                return (
                  <div
                    key={dayIndex}
                    className={`day-cell ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''} ${isFutureDate ? 'future' : ''}`}
                    onClick={() => !isFutureDate && handleToggleTask(date, taskIndex)}
                    style={{ cursor: isFutureDate ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="checkbox">
                    </div>
                  </div>
                );
              })}
              <div className="streak-column">
                {getTaskStreak(taskIndex) > 1 && (
                  <div className={`streak-indicator ${getTaskStreak(taskIndex) >= 7 ? 'high-streak' : ''}`}>
                    <span >👑</span>
                    <span>{getTaskStreak(taskIndex)}</span>
                  </div>
                )}
              </div>
            </div>
            ))}
            
            {/* Add new task row */}
            <div className="task-row add-task-row">
              <div className="task-name">
                <button className="add-new-task-btn" onClick={handleAddTask}>
                  <span className="habit-icon">➕</span>
                  <span className="task-title">Add New Task</span>
                </button>
              </div>
              {weekDates.map((date, dayIndex) => (
                <div key={dayIndex} className="day-cell empty-cell"></div>
              ))}
              <div className="streak-column empty-cell"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="tracker-summary">
        <div className="summary-card">
          <h3>Week {selectedWeek + 1} Summary</h3>
          <div className="summary-stats">
            {weekDates.map((date, index) => {
              const completed = getTasksCompletedForDay(date);
              const total = tracker.tasks.length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return (
                <div key={index} className="day-summary">
                  <div className="day-summary-name">{getDaysOfWeek()[index]}</div>
                  <div className="day-summary-progress">
                    <div className="progress-circle">
                      <span>{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Management Dialog */}
      {showTaskDialog && (
        <div className="create-tracker-overlay">
          <div className="create-tracker-form">
            {dialogType === 'add' ? (
              <>
                <h2>➕ Add New Task</h2>
                <div className="form-group">
                  <label>Task Name</label>
                  <div className="input-container">
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={(e) => {
                        setNewTaskName(e.target.value);
                        setShowSuggestions(true);
                        setValidationError(''); // Clear error when user starts typing
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                      placeholder="Start typing or choose from suggestions..."
                      className="form-input"
                      autoFocus
                    />
                    
                    {showSuggestions && (
                      <div className="suggestions-dropdown">
                        {getFilteredHabits().length > 0 ? (
                          getFilteredHabits().slice(0, 6).map((habit, index) => (
                            <div
                              key={index}
                              className="suggestion-item"
                              onClick={() => handleSuggestionClick(habit)}
                            >
                              {habit}
                            </div>
                          ))
                        ) : newTaskName.length > 0 ? (
                          <div className="suggestion-item no-match">
                            No suggestions found
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {validationError && (
                    <div style={{ 
                      color: '#e53e3e', 
                      fontSize: '0.9rem', 
                      marginTop: '8px',
                      padding: '8px 12px',
                      background: '#fed7d7',
                      borderRadius: '6px',
                      border: '1px solid #feb2b2'
                    }}>
                      ⚠️ {validationError}
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button onClick={confirmAddTask} className="create-btn">
                    Add Task
                  </button>
                  <button onClick={cancelDialog} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>🗑️ Delete Task</h2>
                <div className="form-group">
                  <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.5' }}>
                    Are you sure you want to delete the task <strong>"{tracker.tasks[taskToDelete]}"</strong>?
                  </p>
                  <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginTop: '12px' }}>
                    ⚠️ This will remove all completion data for this task and cannot be undone.
                  </p>
                </div>
                <div className="form-actions">
                  <button onClick={confirmDeleteTask} className="create-btn" style={{ background: '#e53e3e' }}>
                    Delete Task
                  </button>
                  <button onClick={cancelDialog} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerView;
