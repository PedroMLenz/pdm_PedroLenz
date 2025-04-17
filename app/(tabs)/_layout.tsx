import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import {
  Icon,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

const themeLight = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#246BFD",
    background: "#FFFFFF",
    surface: "#F1F1F1",
    tertiary: "#DF2700",
    error: "#DF2700",
    menuBar: "#E0E0E0", // Slightly darker than background
  },
};

const themeDark = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#246BFD",
    background: "#051B31",
    surface: "#002A4B",
    tertiary: "#DF2700",
    error: "#DF2700",
    menuBar: "#12121F", // Slightly darker than background
  },
};

export default function TabLayout() {
  const temaDoApp = useColorScheme();

  return (
    <PaperProvider theme={temaDoApp === "dark" ? themeDark : themeLight}>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor:
            temaDoApp === "dark"
              ? themeDark.colors.primary
              : themeLight.colors.primary,
          tabBarInactiveTintColor: "#65656B",
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              backgroundColor:
                temaDoApp === "dark"
                  ? themeDark.colors.menuBar
                  : themeLight.colors.menuBar,
              borderTopWidth: 0,
            },
            default: {
              backgroundColor:
                temaDoApp === "dark"
                  ? themeDark.colors.menuBar
                  : themeLight.colors.menuBar,
              borderTopWidth: 0,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Icon source="home" color={color} size={20} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Configurações",
            tabBarIcon: ({ color }) => (
              <Icon source="cog" color={color} size={20} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
