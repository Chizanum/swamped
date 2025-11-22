import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import TaskListScreen from "./screens/TaskListScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import ProfileScreen from "./screens/ProfileScreen";


const Tab = createBottomTabNavigator();

export default function App() {
  return (
   

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