import { useState } from 'react'
import useTrackerStore from './store/trackerStore'
import CreateTrackerForm from './components/CreateTrackerForm'
import TrackerCard from './components/TrackerCard'
import TrackerView from './components/TrackerView'
import MonthlyView from './components/MonthlyView'
import EnhancedStats from './components/EnhancedStats'
import { 
  listChecklist,  
  emptyInsideGif,
  emptyShelvesGif,
  laptopIcon, 
  musicIcon, 
  paintIcon, 
  runningIcon, 
  treadmillIcon, 
  weightliftingIcon 
} from './assets'
import "./App.css"

function App() {
  const { trackers, createTracker, updateTracker, deleteTracker, getTracker } = useTrackerStore();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'create', 'tracker', 'monthly', 'stats'
  const [selectedTrackerId, setSelectedTrackerId] = useState(null);
  const [currentGif, setCurrentGif] = useState(0); // For alternating between GIFs

  // Array of available empty state GIFs
  const emptyGifs = [emptyInsideGif, emptyShelvesGif];
  const habitsIcons = [
    laptopIcon,
    musicIcon,
    paintIcon,
    runningIcon,
    weightliftingIcon];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCreateTracker = (trackerData) => {
    createTracker(trackerData);
    setCurrentView('home');
  };

  const handleOpenTracker = (trackerId) => {
    setSelectedTrackerId(trackerId);
    setCurrentView('tracker');
  };

  const handleOpenMonthlyView = (trackerId) => {
    setSelectedTrackerId(trackerId);
    setCurrentView('monthly');
  };

  const handleOpenStats = (trackerId) => {
    setSelectedTrackerId(trackerId);
    setCurrentView('stats');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedTrackerId(null);
  };

  const selectedTracker = selectedTrackerId ? getTracker(selectedTrackerId) : null;

  if (currentView === 'create') {
    return (
      <CreateTrackerForm
        onCreateTracker={handleCreateTracker}
        onCancel={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'tracker' && selectedTracker) {
    return (
      <TrackerView
        tracker={selectedTracker}
        onBack={handleBackToHome}
        onOpenMonthly={() => handleOpenMonthlyView(selectedTracker.id)}
        onOpenStats={() => handleOpenStats(selectedTracker.id)}
      />
    );
  }

  if (currentView === 'monthly' && selectedTracker) {
    return (
      <MonthlyView
        tracker={selectedTracker}
        onBack={() => setCurrentView('tracker')}
        onOpenStats={() => handleOpenStats(selectedTracker.id)}
      />
    );
  }

  if (currentView === 'stats' && selectedTracker) {
    return (
      <EnhancedStats
        tracker={selectedTracker}
        onBack={() => setCurrentView('tracker')}
        onOpenMonthly={() => handleOpenMonthlyView(selectedTracker.id)}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
          <img src={listChecklist} width="100" height="139" alt="logo" />
          <h1>Habit Tracker</h1>
        <p className="date">{today}</p>
      </header>

      <main className="app-main">
        <div className="home-section">
          <div className="create-tracker-section">
            <button 
              className="create-tracker-btn"
              onClick={() => setCurrentView('create')}
            >
              + Create Tracker
            </button>
          </div>

          {trackers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-gif" onClick={() => setCurrentGif((prev) => (prev + 1) % emptyGifs.length)}>
                <img 
                  src={emptyGifs[currentGif]}
                  alt='empty gif'
                  className="empty-animation" 
                />
              </div>
              <h3>No trackers yet!</h3>
              <p>Create your first habit tracker to start building better routines.</p>
              <div className="habit-icons">
                {habitsIcons.map(icon => (
                  <img src={icon} className="habit-icon" />
                ))}
                
              </div>
            </div>
          ) : (
            <div className="trackers-section">
              <h2 className="section-title">Your Trackers ({trackers.length})</h2>
              <div className="trackers-grid">
                {trackers.map(tracker => (
                  <TrackerCard
                    key={tracker.id}
                    tracker={tracker}
                    onOpenTracker={handleOpenTracker}
                    onDeleteTracker={deleteTracker}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Track your progress, build better habits! </p>
      </footer>
    </div>
  )
}

export default App
