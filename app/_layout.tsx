import { AuthProvider } from "@/context/AuthProvider";
import { UserProvider } from "@/context/UserProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const themeLight = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#246BFD",
    background: "#FFFFFF",
    surface: "#F1F1F1",
    tertiary: "#DF2700",
    error: "#DF2700",
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
  },
};

export default function RootLayout() {
  const temaDoApp = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={temaDoApp === "dark" ? themeDark : themeLight}>
      <AuthProvider>
        <UserProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="signIn" />
          </Stack>
          <StatusBar style="auto" />
        </UserProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
