const Stats = ({ habits }) => {
  const today = new Date().toDateString();
  
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(today)
  ).length;
  
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  const getLongestStreak = () => {
    let maxStreak = 0;
    
    habits.forEach(habit => {
      let streak = 0;
      const sortedDates = habit.completedDates
        .map(date => new Date(date))
        .sort((a, b) => b - a);
      
      if (sortedDates.length === 0) return;
      
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      // If not completed today, start from yesterday
      const isCompletedToday = habit.completedDates.includes(today);
      if (!isCompletedToday) {
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      for (let completedDate of sortedDates) {
        completedDate.setHours(0, 0, 0, 0);
        if (completedDate.getTime() === currentDate.getTime()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      maxStreak = Math.max(maxStreak, streak);
    });
    
    return maxStreak;
  };

  return (
    <div className="stats-container">
      <h2>📊 Your Progress</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{completedToday}/{totalHabits}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getLongestStreak()}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalHabits}</div>
          <div className="stat-label">Total Habits</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
