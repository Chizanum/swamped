# Task Manager Mobile App

A simple mobile task manager built with React Native and Expo. Manage tasks with due dates, priorities, descriptions, and user profile with theming support.

---

## Features

- Add, edit, delete, and complete tasks  
- Store tasks persistently using AsyncStorage  
- Filter tasks by status (All, Current, Completed, Urgent, Normal)  
- User profile with editable name and task counts  
- Light and dark theme switching  

---

## Installation

1. Clone the repo:  
   `git clone <repo-url>`

2. Install dependencies:  
   `npm install` or `yarn`

3. Start the development server:  
   `npx expo start`

4. Use Expo Go or an emulator to run the app

---

## Project Structure

- `/app/index.js` — Main entry, sets up bottom tabs and context providers  
- `/app/contexts/ThemeContext.js` — Manages light/dark theme state globally  
- `/app/contexts/TasksContext.js` — Manages tasks and persistence globally  
- `/app/screens/TaskListScreen.js` — Task list UI with filtering, editing, and completion  
- `/app/screens/AddTaskScreen.js` — UI for adding new tasks  
- `/app/screens/ProfileScreen.js` — User profile and theme settings  

---

## Usage

- Navigate between tabs to view tasks, add tasks, or update profile  
- Tap tasks to mark complete/incomplete  
- Use edit buttons to modify tasks  
- Profile tab lets you update your name and toggle app theme

---

## Technologies Used

- React Native  
- Expo  
- AsyncStorage for persistence  
- React Navigation for navigation  
- React Context API for global state  

---

## Contributing

Feel free to fork and submit pull requests for improvements or bug fixes.

---

## License

MIT License

---