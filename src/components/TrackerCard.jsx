const TrackerCard = ({ tracker, onOpenTracker, onDeleteTracker }) => {
  const getDaysRemaining = () => {
    const startDate = new Date(tracker.createdAt);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (tracker.weeks * 7));
    
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const getProgress = () => {
    const totalDays = tracker.weeks * 7;
    const completedDays = Object.keys(tracker.completions || {}).length;
    return Math.round((completedDays / totalDays) * 100);
  };

  const getCompletedTasksToday = () => {
    const today = new Date().toDateString();
    const todayCompletions = tracker.completions?.[today] || {};
    return Object.values(todayCompletions).filter(Boolean).length;
  };

  const daysRemaining = getDaysRemaining();
  const progress = getProgress();
  const completedToday = getCompletedTasksToday();

  return (
    <div className="tracker-card" onClick={() => onOpenTracker(tracker.id)}>
      <div className="tracker-header">
        <h3 className="tracker-title">{tracker.title}</h3>
        <button
          className="tracker-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTracker(tracker.id);
          }}
        >
          🗑️
        </button>
      </div>
      
      <div className="tracker-stats">
        <div className="stat">
          <span className="stat-number">{completedToday}/{tracker.tasks.length}</span>
          <span className="stat-label">Today</span>
        </div>
        <div className="stat">
          <span className="stat-number">{progress}%</span>
          <span className="stat-label">Complete</span>
        </div>
        <div className="stat">
          <span className="stat-number">{daysRemaining}</span>
          <span className="stat-label">Days Left</span>
        </div>
      </div>

      <div className="tracker-preview">
        <div className="tasks-preview">
          {tracker.tasks.slice(0, 3).map((task, index) => (
            <div key={index} className="task-preview">
              • {task}
            </div>
          ))}
          {tracker.tasks.length > 3 && (
            <div className="task-preview more">
              +{tracker.tasks.length - 3} more...
            </div>
          )}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TrackerCard;
