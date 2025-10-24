import { useState } from 'react';

const AddHabitForm = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim());
      setHabitName('');
      setIsExpanded(false);
      setShowSuggestions(false);
    }
  };

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

  const filteredHabits = habitName.length === 0 
    ? predefinedHabits 
    : predefinedHabits.filter(habit =>
        habit.toLowerCase().includes(habitName.toLowerCase())
      );

  const handleInputChange = (e) => {
    setHabitName(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (habit) => {
    setHabitName(habit);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 300);
  };

  return (
    <div className="add-habit-container">
      {!isExpanded ? (
        <button 
          className="add-habit-trigger"
          onClick={() => setIsExpanded(true)}
        >
          + Add New Habit
        </button>
      ) : (
        <div className="add-habit-form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                value={habitName}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Start typing or choose from suggestions..."
                className="habit-input"
                autoFocus
              />
              
              {showSuggestions && (
                <div className="suggestions-dropdown">
                  {filteredHabits.length > 0 ? (
                    filteredHabits.slice(0, 6).map((habit, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(habit)}
                      >
                        {habit}
                      </div>
                    ))
                  ) : habitName.length > 0 ? (
                    <div className="suggestion-item no-match">
                      No suggestions found
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Add Habit
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setIsExpanded(false);
                  setHabitName('');
                  setShowSuggestions(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddHabitForm;
