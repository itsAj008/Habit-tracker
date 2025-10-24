#!/bin/bash

# Habit Tracker CSS Switcher
# Usage: ./switch-css.sh [tailwind|original]

MODE=${1:-"help"}

case $MODE in
  "tailwind")
    echo "🎨 Switching to Tailwind CSS..."
    # Make sure Tailwind files exist
    if [ ! -f "src/index.css" ] || ! grep -q "@tailwind" src/index.css; then
      echo "⚠️  Tailwind CSS not found. Setting up..."
      if [ -f "src/index.tailwind.css" ]; then
        cp src/index.tailwind.css src/index.css
      else
        echo "❌ Tailwind CSS files not found!"
        exit 1
      fi
    fi
    
    # Comment out CSS import in App.jsx
    sed -i.tmp 's/^import .*App\.css.*/\/\/ import ".\/App.css" \/\/ Backup CSS - uncomment if Tailwind fails/' src/App.jsx && rm src/App.jsx.tmp
    
    echo "✅ Switched to Tailwind CSS!"
    echo "🚀 Restart your dev server: npm run dev"
    ;;
    
  "original")
    echo "🔙 Switching to Original CSS..."
    
    # Restore original CSS files
    if [ -f "src/App.css.backup" ]; then
      cp src/App.css.backup src/App.css
      echo "✅ Restored App.css"
    fi
    
    if [ -f "src/index.css.backup" ]; then
      cp src/index.css.backup src/index.css  
      echo "✅ Restored index.css"
    fi
    
    # Uncomment CSS import in App.jsx
    sed -i.tmp 's/^\/\/ import .*App\.css.*/import ".\/App.css"/' src/App.jsx && rm src/App.jsx.tmp
    
    echo "✅ Switched to Original CSS!"
    echo "🚀 Restart your dev server: npm run dev"
    ;;
    
  "help"|*)
    echo "🎯 Habit Tracker CSS Switcher"
    echo ""
    echo "Usage:"
    echo "  ./switch-css.sh tailwind   # Switch to Tailwind CSS"
    echo "  ./switch-css.sh original   # Switch to Original CSS"
    echo ""
    echo "Current status:"
    if grep -q "@tailwind" src/index.css 2>/dev/null; then
      echo "📝 Currently using: Tailwind CSS"
    else
      echo "📝 Currently using: Original CSS"
    fi
    ;;
esac
