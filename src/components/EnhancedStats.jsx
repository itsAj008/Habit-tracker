import useTrackerStore from '../store/trackerStore';

const EnhancedStats = ({ tracker, onBack, onOpenMonthly }) => {
  const storeActions = useTrackerStore();

  const getOverallStats = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const days = [];
    for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    const completionRates = days.map(date => {
      const completed = storeActions.getCompletedTasksForDay(tracker.id, date);
      return (completed / tracker.tasks.length) * 100;
    });

    const perfectDays = completionRates.filter(rate => rate === 100).length;
    const averageCompletion = Math.round(completionRates.reduce((acc, rate) => acc + rate, 0) / completionRates.length);
    
    // Calculate best streak
    let bestStreak = 0;
    let currentStreak = 0;
    
    for (let i = 0; i < days.length; i++) {
      const completed = storeActions.getCompletedTasksForDay(tracker.id, days[i]);
      if (completed === tracker.tasks.length) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Find best day of week
    const dayStats = {};
    days.forEach(date => {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (!dayStats[dayName]) dayStats[dayName] = [];
      const completed = storeActions.getCompletedTasksForDay(tracker.id, date);
      dayStats[dayName].push((completed / tracker.tasks.length) * 100);
    });

    let bestDay = '';
    let bestDayRate = 0;
    Object.entries(dayStats).forEach(([day, rates]) => {
      const avgRate = rates.reduce((acc, rate) => acc + rate, 0) / rates.length;
      if (avgRate > bestDayRate) {
        bestDayRate = avgRate;
        bestDay = day;
      }
    });

    return {
      averageCompletion,
      perfectDays,
      bestStreak,
      bestDay,
      totalCompleted: days.reduce((acc, date) => {
        return acc + storeActions.getCompletedTasksForDay(tracker.id, date);
      }, 0)
    };
  };

  const getCurrentWeekStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    return weekDays.map(date => {
      const completed = storeActions.getCompletedTasksForDay(tracker.id, date);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        percentage: Math.round((completed / tracker.tasks.length) * 100),
        completed,
        total: tracker.tasks.length
      };
    });
  };

  const stats = getOverallStats();
  const weekStats = getCurrentWeekStats();

  return (
    <div className="enhanced-stats">
      <div className="stats-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h2 className="stats-title">{tracker.title} - Statistics</h2>
        <div className="view-switcher">
          <button className="view-btn" onClick={() => onBack()}>Weekly</button>
          <button className="view-btn" onClick={onOpenMonthly}>Monthly</button>
          <button className="view-btn active">Stats</button>
        </div>
      </div>

      <div className="stats-period-info">
        <div className="stats-period">Last 30 Days Analysis</div>
      </div>

      <div className="stats-overview">
        <div className="overview-card completion">
          <div className="overview-value">{stats.averageCompletion}%</div>
          <div className="overview-label">Completion Rate</div>
        </div>

        <div className="overview-card perfect">
          <div className="overview-value">{stats.perfectDays}</div>
          <div className="overview-label">Perfect Days</div>
        </div>

        <div className="overview-card habits">
          <div className="overview-value">{stats.totalCompleted}</div>
          <div className="overview-label">Total Completed</div>
        </div>

        <div className="overview-card streak">
          <div className="overview-value">{stats.bestStreak}</div>
          <div className="overview-label">Best Streak</div>
        </div>
      </div>

      <div className="weekly-overview">
        <h3 className="section-title">📊 Weekly Overview</h3>
        <div className="week-bars">
          {weekStats.map((day, index) => (
            <div key={index} className={`week-bar ${day.percentage >= 80 ? 'excellent' : day.percentage >= 50 ? 'good' : 'poor'}`} style={{ height: `${Math.max(day.percentage, 10)}%` }}>
              <div className="week-bar-value">{day.percentage}%</div>
              <div className="week-bar-label">{day.day}</div>
            </div>
          ))}
        </div>
        <div className="week-summary">
          Your weekly completion pattern shows consistent progress across the week.
        </div>
      </div>

      <div className="achievements-section">
        <h3 className="section-title">🏆 Achievements</h3>
        <div className="achievements-grid">
          {stats.perfectDays >= 7 && (
            <div className="achievement-badge earned">
              <div className="achievement-icon">🌟</div>
              <div className="achievement-title">Week Warrior</div>
              <div className="achievement-desc">7+ Perfect Days</div>
            </div>
          )}
          
          {stats.bestStreak >= 5 && (
            <div className="achievement-badge earned">
              <div className="achievement-icon">🔥</div>
              <div className="achievement-title">Streak Master</div>
              <div className="achievement-desc">5+ Day Streak</div>
            </div>
          )}

          {stats.averageCompletion >= 80 && (
            <div className="achievement-badge earned">
              <div className="achievement-icon">💎</div>
              <div className="achievement-title">Consistency King</div>
              <div className="achievement-desc">80%+ Average</div>
            </div>
          )}
          
          <div className="achievement-badge">
            <div className="achievement-icon">🎯</div>
            <div className="achievement-title">Perfect Month</div>
            <div className="achievement-desc">30 Perfect Days</div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h3 className="section-title">💡 Insights</h3>
        <div className="insights-list">
          <div className="insight-item">
            📈 Your completion rate has been {stats.averageCompletion >= 70 ? 'excellent' : 'steady'} over the past 30 days.
          </div>
          {stats.bestStreak > 1 && (
            <div className="insight-item">
              🔥 Your best streak was {stats.bestStreak} days - keep building those habits!
            </div>
          )}
          {stats.perfectDays > 0 && (
            <div className="insight-item">
              ⭐ You've had {stats.perfectDays} perfect days where you completed all habits.
            </div>
          )}
          <div className="insight-item">
            📅 Your best day is <strong>{stats.bestDay}</strong>. Consider scheduling important habits on this day!
          </div>
          {stats.averageCompletion < 50 && (
            <div className="insight-item">
              💪 Try starting with fewer habits to build consistency. Quality over quantity!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedStats;
