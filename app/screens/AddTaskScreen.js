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

const STORAGE_KEY = "@tasks";

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert("Please enter a task title");
      return;
    }

    try {
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

      setTitle("");
      setPriority("medium");
      setDescription("");
      setDueDate(null);
      navigation.navigate("Tasks");
    } catch (e) {
      Alert.alert("Failed to save task");
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "dismissed") return;
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
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <View style={styles.priorityContainer}>
        {["low", "medium", "high"].map((level) => (
          <Button
            key={level}
            title={level.charAt(0).toUpperCase() + level.slice(1)}
            color={priority === level ? "#2f95dc" : "gray"}
            onPress={() => setPriority(level)}
          />
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

      <Button title="Add Task" onPress={saveTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
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