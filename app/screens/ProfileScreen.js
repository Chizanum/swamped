import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = "@tasks";
const NAME_KEY = "@username";

export default function ProfileScreen() {
  const [tasks, setTasks] = useState([]);
  const [viewCompleted, setViewCompleted] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadTasks();
    loadUserName();
  }, []);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(TASKS_KEY);
      if (stored) setTasks(JSON.parse(stored));
      else setTasks([]);
    } catch (e) {
      console.log("Failed to load tasks", e);
    }
  };

  const loadUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem(NAME_KEY);
      if (storedName) setUserName(storedName);
    } catch (e) {
      console.log("Failed to load user name", e);
    }
  };

  const saveUserName = async (name) => {
    try {
      await AsyncStorage.setItem(NAME_KEY, name);
      Alert.alert("Name saved!");
    } catch (e) {
      Alert.alert("Failed to save name");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    viewCompleted ? task.completed : !task.completed
  );

  const currentCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text
        style={[styles.taskTitle, item.completed && styles.completedTask]}
      >
        {item.title}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name:</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="Enter your name"
        onEndEditing={() => saveUserName(userName.trim())}
      />

      <Text style={styles.greeting}>Hello, {userName || "User"}!</Text>

      <Text style={styles.counts}>
        Current Tasks: {currentCount} | Completed Tasks: {completedCount}
      </Text>

      <View style={styles.filterButtons}>
        <Pressable
          style={[styles.filterBtn, !viewCompleted && styles.filterBtnActive]}
          onPress={() => setViewCompleted(false)}
        >
          <Text style={[styles.filterText, !viewCompleted && styles.filterTextActive]}>Current Tasks</Text>
        </Pressable>
        <Pressable
          style={[styles.filterBtn, viewCompleted && styles.filterBtnActive]}
          onPress={() => setViewCompleted(true)}
        >
          <Text style={[styles.filterText, viewCompleted && styles.filterTextActive]}>Completed Tasks</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No tasks</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  counts: {
    fontSize: 16,
    marginBottom: 20,
  },
  filterButtons: { flexDirection: "row", marginVertical: 20 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "white",
  },
  filterBtnActive: { backgroundColor: "#2f95dc", borderColor: "#2f95dc" },
  filterText: { textAlign: "center", color: "#444" },
  filterTextActive: { color: "white", fontWeight: "bold" },
  taskItem: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: { fontSize: 16 },
  completedTask: { textDecorationLine: "line-through", color: "#888" },
});