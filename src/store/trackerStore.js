import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useTrackerStore = create(
  persist(
    (set, get) => ({
      // State
      trackers: [],
      
      // Actions
      createTracker: (trackerData) => {
        const newTracker = {
          id: Date.now().toString(),
          ...trackerData,
          completions: {}
        };
        
        set((state) => ({
          trackers: [...state.trackers, newTracker]
        }));
        
        return newTracker.id;
      },

      updateTracker: (trackerId, updates) => {
        set((state) => ({
          trackers: state.trackers.map(tracker => 
            tracker.id === trackerId 
              ? { ...tracker, ...updates }
              : tracker
          )
        }));
      },

      deleteTracker: (trackerId) => {
        set((state) => ({
          trackers: state.trackers.filter(tracker => tracker.id !== trackerId)
        }));
      },

      getTracker: (trackerId) => {
        const state = get();
        return state.trackers.find(tracker => tracker.id === trackerId);
      },

      clearAllTrackers: () => {
        set({ trackers: [] });
      },

      // Task completion methods
      toggleTaskCompletion: (trackerId, date, taskIndex) => {
        const dateKey = date.toDateString();
        
        set((state) => ({
          trackers: state.trackers.map(tracker => {
            if (tracker.id === trackerId) {
              const currentCompletions = tracker.completions || {};
              const dayCompletions = currentCompletions[dateKey] || {};
              
              return {
                ...tracker,
                completions: {
                  ...currentCompletions,
                  [dateKey]: {
                    ...dayCompletions,
                    [taskIndex]: !dayCompletions[taskIndex]
                  }
                }
              };
            }
            return tracker;
          })
        }));
      },

      isTaskCompleted: (trackerId, date, taskIndex) => {
        const state = get();
        const tracker = state.trackers.find(t => t.id === trackerId);
        if (!tracker) return false;
        
        const dateKey = date.toDateString();
        return tracker.completions?.[dateKey]?.[taskIndex] || false;
      },

      getCompletedTasksForDay: (trackerId, date) => {
        const state = get();
        const tracker = state.trackers.find(t => t.id === trackerId);
        if (!tracker) return 0;
        
        const dateKey = date.toDateString();
        const dayCompletions = tracker.completions?.[dateKey] || {};
        return Object.values(dayCompletions).filter(Boolean).length;
      },

      // Task management methods
      addTaskToTracker: (trackerId, taskName) => {
        set((state) => ({
          trackers: state.trackers.map(tracker => {
            if (tracker.id === trackerId) {
              return {
                ...tracker,
                tasks: [...tracker.tasks, taskName]
              };
            }
            return tracker;
          })
        }));
      },

      removeTaskFromTracker: (trackerId, taskIndex) => {
        set((state) => ({
          trackers: state.trackers.map(tracker => {
            if (tracker.id === trackerId) {
              const newTasks = tracker.tasks.filter((_, index) => index !== taskIndex);
              
              // Also clean up completion data for the removed task
              const newCompletions = {};
              Object.keys(tracker.completions || {}).forEach(dateKey => {
                const dayCompletions = tracker.completions[dateKey];
                const newDayCompletions = {};
                
                // Reindex completions - shift indices down for tasks after the deleted one
                Object.keys(dayCompletions).forEach(taskIndexStr => {
                  const currentTaskIndex = parseInt(taskIndexStr);
                  if (currentTaskIndex < taskIndex) {
                    // Keep tasks before the deleted one at same index
                    newDayCompletions[currentTaskIndex] = dayCompletions[taskIndexStr];
                  } else if (currentTaskIndex > taskIndex) {
                    // Shift tasks after the deleted one down by 1
                    newDayCompletions[currentTaskIndex - 1] = dayCompletions[taskIndexStr];
                  }
                  // Skip the deleted task (currentTaskIndex === taskIndex)
                });
                
                if (Object.keys(newDayCompletions).length > 0) {
                  newCompletions[dateKey] = newDayCompletions;
                }
              });
              
              return {
                ...tracker,
                tasks: newTasks,
                completions: newCompletions
              };
            }
            return tracker;
          })
        }));
      }
    }),
    {
      name: 'habit-tracker-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ 
        trackers: state.trackers 
      }), // Only persist the trackers data
    }
  )
);

export default useTrackerStore;
