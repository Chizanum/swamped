// Screen: AddTaskScreen
// Allows the user to create a new task with title, description, priority and optional due date.
// Tasks are persisted to AsyncStorage under `STORAGE_KEY`.
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

// AsyncStorage key used by this screen (keeps parity with the rest of the app)
const STORAGE_KEY = "@tasks";

export default function AddTaskScreen({ navigation }) {
  // Local form state for the new task
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null); // Date or null
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveTask = async () => {
    // Basic validation: title is required
    if (!title.trim()) {
      Alert.alert("Please enter a task title");
      return;
    }

    try {
      // Load existing tasks, create newTask object and persist
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const tasks = stored ? JSON.parse(stored) : [];

      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        priority,
        description: description.trim(),
        dueDate: dueDate ? dueDate.toISOString() : null,
        completed: false,
      };

      const updatedTasks = [newTask, ...tasks];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

      // Reset form and navigate back to the tasks list
      setTitle("");
      setPriority("medium");
      setDescription("");
      setDueDate(null);
      navigation.navigate("Tasks");
    } catch (e) {
      Alert.alert("Failed to save task");
    }
  };

  // Handler for DateTimePicker: hides the picker and stores the selected date.
  // Guard clause handles the 'dismissed' event on Android.
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event?.type === "dismissed") return;
    if (!selectedDate) return;
    setDueDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Task description"
        value={description}
        onChangeText={setDescription}
        style={[styles.inputDes, { height: 80 }]}
        multiline
      />

      <View style={styles.priorityContainer}>
        {["low", "medium", "high"].map((level) => (
          <TouchableOpacity
  key={level}
  onPress={() => setPriority(level)}
  style={{
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: priority === level ? "#000000ff" : "black",
    borderRadius: 20,
    backgroundColor: priority === level ? "#fff" : "black",
  }}
>
  <Text style={{
    color: priority === level ? "#000" : "white",
    fontWeight: "600"
  }}>
    {level.charAt(0).toUpperCase() + level.slice(1)}
  </Text>
</TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: dueDate ? "#000" : "#888" }}>
          {dueDate
            ? dueDate.toLocaleDateString()
            : "Set Due Date (optional)"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

     <TouchableOpacity
  onPress={saveTask}
  style={{
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10
  }}
>
  <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
    Add Task
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingInline: 30, paddingBlock:20 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },

  inputDes: {
    borderWidth: 1,
    marginBlock: 20,
    paddingVertical: 8,
    fontSize: 16,
  },

  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
});