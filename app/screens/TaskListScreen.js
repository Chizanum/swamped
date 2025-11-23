// Screen: TaskListScreen
// Displays the list of tasks, supports filtering, editing, deleting and marking complete.
// Tasks are persisted in AsyncStorage under `STORAGE_KEY` and loaded when the screen is focused.
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Button,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Storage key and available filters for the list view
const STORAGE_KEY = "@tasks";
const FILTERS = ["All", "Urgent", "Normal", "Completed"];

export default function TaskListScreen() {
  // Component state
  const [tasks, setTasks] = useState([]); // array of task objects
  const [filter, setFilter] = useState("All"); // current filter tab
  const [editingTask, setEditingTask] = useState(null); // task being edited
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingPriority, setEditingPriority] = useState("medium");
  const [editingDueDate, setEditingDueDate] = useState(null); // Date or null
  const [showDatePicker, setShowDatePicker] = useState(false);
  const activeCount = tasks.filter((task) => !task.completed).length;

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
      else setTasks([]);
    } catch (e) {
      console.log("Failed to load tasks", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (e) {
      console.log("Failed to save tasks", e);
    }
  };

  // Compute the list of tasks that match the active filter
  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "Urgent":
        return task.priority === "high" && !task.completed;
      case "Normal":
        return task.priority === "medium" && !task.completed;
      case "Completed":
        return task.completed;
      case "All":
      default:
        return true;
    }
  });

  const toggleCompleted = (id) => {
    // Toggle the completed flag for a task and persist the change
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    // Remove a task by id and persist
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
    setEditingPriority(task.priority || "medium");
    setEditingDueDate(task.dueDate ? new Date(task.dueDate) : null);
  };

  const saveEdit = () => {
    if (!editingTitle.trim()) return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id
        ? {
            ...task,
            title: editingTitle.trim(),
            description: editingDescription.trim(),
            priority: editingPriority,
            dueDate: editingDueDate ? editingDueDate.toISOString() : null,
          }
        : task
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingPriority("medium");
    setEditingDueDate(null);
    setShowDatePicker(false);
  };

  // Date picker handler used when editing a task's due date.
  // It hides the picker and updates the editingDueDate state.
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event?.type === "dismissed") return;
    if (!selectedDate) return;
    setEditingDueDate(selectedDate);
  };

  const renderItem = ({ item }) => (
    
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => toggleCompleted(item.id)}
        style={{ flex: 1 }}
      >
        <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.descriptionText}>{item.description}</Text>
        ) : null}
        {item.dueDate ? (
          <Text style={styles.dueDateText}>
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => startEditing(item)} style={styles.iconButton}>
        <Ionicons name="pencil" size={24} color="#2f95dc" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.iconButton}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

       
      <View style={styles.section1}>
        <Text style={styles.title}>Swamped</Text>

        <View style={styles.activeTasks}>
          <Text style={styles.activeTasksCount}>{activeCount}</Text>
          <Text style={styles.activeTasksTitle}>Active tasks</Text>
        </View>

        <View style={styles.lineBlock}></View>
      </View>
      <View style={styles.section2}></View>
      <View style={styles.section3}></View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[styles.filterText, filter === f && styles.filterTextActive]}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: "center" }}>No tasks</Text>}
        style={styles.list}
      />

      {/* Edit Modal */}
      <Modal visible={!!editingTask} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Edit Task</Text>
            <TextInput
              value={editingTitle}
              onChangeText={setEditingTitle}
              style={styles.input}
              autoFocus
              placeholder="Task Title"
            />
            <TextInput
              value={editingDescription}
              onChangeText={setEditingDescription}
              style={[styles.input, { height: 80 }]}
              multiline
              placeholder="Task Description"
            />
            <View style={styles.priorityContainer}>
              {["low", "medium", "high"].map((level) => (
                <Button
                  key={level}
                  title={level.charAt(0).toUpperCase() + level.slice(1)}
                  color={editingPriority === level ? "#2f95dc" : "gray"}
                  onPress={() => setEditingPriority(level)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: editingDueDate ? "#000" : "#888" }}>
                {editingDueDate
                  ? editingDueDate.toLocaleDateString()
                  : "Set Due Date (optional)"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={editingDueDate || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={cancelEdit} />
              <Button title="Save" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },


  section1: {
    flex:2,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
  },



  title: { fontWeight: "bold", fontSize: 25 },

  activeTasks: {
    backgroundColor: "#a0a0a0ff",
    width: 170,
    height: 170,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
  },

  activeTasksCount: { fontWeight: "bold", fontSize: 50 },

  activeTasksTitle: { fontSize: 20 },

  lineBlock: {
    width: 100,
    height: 10,
    borderRadius: 20,
    backgroundColor: "#000",
  },

  list: {
    maxHeight:300,
  },
  taskItem: {
    backgroundColor: "#afafafff",
    borderWidth: 1,
    borderColor: "#040404ff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  taskTitle: { fontSize: 16 },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  descriptionText: {
    color: "#555",
    fontStyle: "italic",
  },
  dueDateText: {
    color: "#444",
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#040404ff",
  },
  filterTabActive: {
    backgroundColor: "#000000ff",
    borderColor: "#000000ff",
  },
  filterText: {
    color: "#444",
  },
  filterTextActive: {
    color: "white",
  },
  iconButton: {
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});