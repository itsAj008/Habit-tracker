import { useState } from 'react';

const CreateTrackerForm = ({ onCreateTracker, onCancel }) => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState(['']);
  const [weeks, setWeeks] = useState(4);
  const [showSuggestions, setShowSuggestions] = useState({});

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

  const addTask = () => {
    setTasks([...tasks, '']);
  };

  const removeTask = (index) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const getFilteredHabits = (taskValue) => {
    return taskValue.length === 0 
      ? predefinedHabits 
      : predefinedHabits.filter(habit =>
          habit.toLowerCase().includes(taskValue.toLowerCase())
        );
  };

  const handleTaskFocus = (index) => {
    setShowSuggestions({ ...showSuggestions, [index]: true });
  };

  const handleTaskBlur = (index) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions({ ...showSuggestions, [index]: false });
    }, 300);
  };

  const handleSuggestionClick = (index, habit) => {
    const newTasks = [...tasks];
    newTasks[index] = habit;
    setTasks(newTasks);
    setShowSuggestions({ ...showSuggestions, [index]: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validTasks = tasks.filter(task => task.trim());
    
    // Check for duplicate tasks
    const taskCounts = {};
    const duplicates = [];
    
    validTasks.forEach(task => {
      const normalizedTask = task.toLowerCase().trim();
      if (taskCounts[normalizedTask]) {
        if (!duplicates.includes(task.trim())) {
          duplicates.push(task.trim());
        }
      } else {
        taskCounts[normalizedTask] = 1;
      }
    });
    
    if (duplicates.length > 0) {
      alert(`Duplicate tasks found: ${duplicates.join(', ')}. Please remove duplicates before creating the tracker.`);
      return;
    }
    
    if (title.trim() && validTasks.length > 0) {
      onCreateTracker({
        title: title.trim(),
        tasks: validTasks,
        weeks,
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="create-tracker-overlay">
      <div className="create-tracker-form">
        <h2>🎯 Create New Tracker</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tracker Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Routine, Fitness Goals..."
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Daily Tasks</label>
            {tasks.map((task, index) => (
              <div key={index} className="task-input-group" style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={task}
                  onChange={(e) => updateTask(index, e.target.value)}
                  onFocus={() => handleTaskFocus(index)}
                  onBlur={() => handleTaskBlur(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (index === tasks.length - 1 && task.trim()) {
                        addTask();
                      }
                    }
                  }}
                  placeholder={`Task ${index + 1}`}
                  className="form-input task-input"
                />
                
                {showSuggestions[index] && (
                  <div className="suggestions-dropdown">
                    {getFilteredHabits(task).length > 0 ? (
                      getFilteredHabits(task).slice(0, 6).map((habit, habitIndex) => (
                        <div
                          key={habitIndex}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(index, habit)}
                        >
                          {habit}
                        </div>
                      ))
                    ) : task.length > 0 ? (
                      <div className="suggestion-item no-match">
                        No suggestions found
                      </div>
                    ) : null}
                  </div>
                )}
                
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="remove-task-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTask}
              className="add-task-btn"
            >
              + Add Task
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="weeks">Number of Weeks</label>
            <select
              id="weeks"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="form-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                <option key={num} value={num}>{num} week{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="create-btn">
              Create Tracker
            </button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrackerForm;
