// TasksContext: provides tasks state and helpers to modify it across the app.
// It persists tasks to AsyncStorage under `STORAGE_KEY` so tasks survive app restarts.
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage key used to persist tasks
const STORAGE_KEY = "@tasks";

// Context object exported for consumers to use via `useContext(TasksContext)`
export const TasksContext = createContext();

export function TasksProvider({ children }) {
  // In-memory tasks state (array of task objects)
  const [tasks, setTasks] = useState([]);

  // Load tasks from persistent storage when the provider mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Read tasks from AsyncStorage. If none, initialize to empty array.
  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
    } catch (e) {
      console.log("Failed to load tasks", e);
    }
  };

  // Save provided tasks array to AsyncStorage.
  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (e) {
      console.log("Failed to save tasks", e);
    }
  };

  // Public API: addTask - prepends a new task and persists the change
  const addTask = async (task) => {
    const updatedTasks = [task, ...tasks];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  // Public API: updateTask - replaces a task by id and persists
  const updateTask = async (updatedTask) => {
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  // Public API: deleteTask - removes a task by id and persists
  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  // Provide the tasks array and helper functions to consumers
  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}