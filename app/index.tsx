// App entry point: sets up bottom tab navigation and registers main screens.
// This file is intentionally small — it composes the navigator from screen components.
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import TaskListScreen from "./screens/TaskListScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import ProfileScreen from "./screens/ProfileScreen";


// Bottom tab navigator used for primary app navigation
const Tab = createBottomTabNavigator();

export default function App() {
  // Main App component which returns the Navigation container and tab navigator.
  // You can wrap this with a ThemeProvider or Context providers as needed.
  return (
    // Note: `NavigationContainer` could be added here if you need deep linking or theme support.
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === "Tasks") iconName = "list";
                  else if (route.name === "Add") iconName = "add-circle";
                  else if (route.name === "Profile") iconName = "person";
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#2f95dc",
                tabBarInactiveTintColor: "gray",
              })}
            >
              <Tab.Screen name="Tasks" component={TaskListScreen} />
              <Tab.Screen name="Add" component={AddTaskScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
         
        
      
  );
}