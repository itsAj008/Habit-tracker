import { useState } from 'react';
import useTrackerStore from '../store/trackerStore';
import perfectImage from '../assets/perfect.png';

const MonthlyView = ({ tracker, onBack, onOpenStats }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const storeActions = useTrackerStore();

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getCompletionPercentage = (date) => {
    const completed = storeActions.getCompletedTasksForDay(tracker.id, date);
    return Math.round((completed / tracker.tasks.length) * 100);
  };

  const getStreakForDay = (date) => {
    // Calculate streak ending on this day
    let streak = 0;
    let currentDate = new Date(date);
    
    while (true) {
      const completed = storeActions.getCompletedTasksForDay(tracker.id, currentDate);
      if (completed === tracker.tasks.length) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getDayClass = (date, percentage) => {
    if (percentage === 100) return 'perfect-day';
    if (percentage >= 80) return 'great-day';
    if (percentage >= 50) return 'good-day';
    if (percentage > 0) return 'partial-day';
    return 'incomplete-day';
  };

  const monthDays = getMonthDays();
  const today = new Date().toDateString();

  return (
    <div className="monthly-view">
      <div className="monthly-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1 className="monthly-title">{tracker.title}</h1>
        <div className="view-switcher">
          <button className="view-btn" onClick={() => onBack()}>Weekly</button>
          <button className="view-btn active">Monthly</button>
          <button className="view-btn" onClick={onOpenStats}>Stats</button>
        </div>
      </div>

      <div className="month-navigation">
        <button onClick={() => navigateMonth(-1)} className="month-nav-btn">
          ←
        </button>
        <h2 className="current-month">{getMonthName()}</h2>
        <button onClick={() => navigateMonth(1)} className="month-nav-btn">
          →
        </button>
      </div>

      <div className="habits-legend">
        {tracker.tasks.map((task, index) => (
          <div key={index} className="habit-legend-item">
            <div className={`habit-color-indicator habit-color-${index % 6}`}></div>
            <span>{task}</span>
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        <div className="calendar-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
        </div>
        
        <div className="calendar-body">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: monthDays[0].getDay() }, (_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          
          {monthDays.map(date => {
            const percentage = getCompletionPercentage(date);
            const streak = getStreakForDay(date);
            const isToday = date.toDateString() === today;
            
            return (
              <div 
                key={date.getDate()} 
                className={`calendar-day ${getDayClass(date, percentage)} ${isToday ? 'today' : ''}`}
              >
                <div className="day-number">{date.getDate()}</div>
                <div className="day-percentage">{percentage}%</div>
                {streak > 1 && <div className="day-streak">🔥{streak}</div>}
                
                {/* Show perfect image when all tasks are completed */}
                {percentage === 100 && (
                  <div className="perfect-day-indicator">
                    <img 
                      src={perfectImage} 
                      alt="Perfect Day" 
                      className="perfect-image"
                      title="Perfect Day! All tasks completed!"
                    />
                  </div>
                )}
                
                <div className="habit-dots">
                  {tracker.tasks.map((task, taskIndex) => {
                    const isCompleted = storeActions.isTaskCompleted(tracker.id, date, taskIndex);
                    // Only show dots for completed tasks
                    if (!isCompleted) return null;
                    
                    return (
                      <div 
                        key={taskIndex}
                        className={`habit-dot habit-color-${taskIndex % 6} completed`}
                        title={`${task} - Completed`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="monthly-stats">
        <div className="stat-card">
          <div className="stat-number">{Math.round(monthDays.reduce((acc, date) => acc + getCompletionPercentage(date), 0) / monthDays.length)}%</div>
          <div className="stat-label">Monthly Average</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{monthDays.filter(date => getCompletionPercentage(date) === 100).length}</div>
          <div className="stat-label">Perfect Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Math.max(...monthDays.map(date => getStreakForDay(date)))}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
