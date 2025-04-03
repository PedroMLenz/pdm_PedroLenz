import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Icon, useTheme } from "react-native-paper";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#65656B", // Set inactive color
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: "#222232", // Set bottom bar color
            borderTopWidth: 0, // Remove white border
          },
          default: {
            backgroundColor: "#222232", // Set bottom bar color
            borderTopWidth: 0, // Remove white border
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon source="home" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon source="account" color={color} size={20} />
          ),
        }}
      />
    </Tabs>
  );
}
