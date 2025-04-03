import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        Profile
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
