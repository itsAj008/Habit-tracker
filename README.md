# 🎯 Habit Tracker

A beautiful and intuitive habit tracking application built with React and Vite. Track your daily habits, build streaks, and monitor your progress with an elegant, modern interface.

## ✨ Features

- **📝 Easy Habit Management**: Add new habits with quick suggestions or create custom ones
- **✅ Daily Tracking**: Mark habits as complete with a single click
- **🔥 Streak Tracking**: Monitor your consistency with automatic streak calculations
- **📊 Progress Statistics**: View your completion rates and longest streaks
- **💾 Data Persistence**: All data is automatically saved to local storage
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Built With

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with flexbox and grid
- **Local Storage** - Client-side data persistence

## 📱 How to Use

1. **Add a Habit**: Click "Add New Habit" and either choose from suggestions or create a custom habit
2. **Mark Complete**: Click "Mark Complete" when you've completed a habit for the day
3. **View Stats**: Switch to the Stats tab to see your progress and streaks
4. **Manage Habits**: Use the menu (⋮) on each habit card to delete habits you no longer need

## 🎨 Features in Detail

### Habit Management
- Quick suggestions for common habits
- Custom habit creation
- Easy deletion with confirmation

### Progress Tracking
- Daily completion tracking
- Automatic streak calculation
- Overall statistics and completion rates
- Visual progress indicators

### Data Persistence
- Automatic saving to browser's local storage
- Data persists between sessions
- No account or internet connection required

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── HabitCard.jsx   # Individual habit display
│   ├── AddHabitForm.jsx # Form for adding new habits
│   └── Stats.jsx       # Statistics dashboard
├── hooks/              # Custom React hooks
│   └── useHabits.js    # Habit management logic
├── App.jsx             # Main application component
├── App.css             # Application styles
└── main.jsx            # Application entry point
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests. Some ideas for contributions:

- Add habit categories
- Implement habit reminders
- Add data export functionality
- Create weekly/monthly views
- Add habit difficulty levels

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React and Vite for optimal performance
- Inspired by popular habit tracking methodologies
- Icons from emoji sets for a friendly interface
