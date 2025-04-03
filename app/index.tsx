import { AuthContext } from "@/context/AuthProvider";
import { useContext, useState } from "react";
import { router } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const theme = useTheme();
  const { signIn } = useContext<any>(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [exibirSenha, setExibirSenha] = useState(true);

  async function entrar() {
    const response = await signIn({
      email: email,
      senha: senha,
    });
    console.log(response);
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.image}
      />
      <TextInput
        style={styles.textinput}
        label="Email"
        placeholder="Digite seu email"
        mode="outlined"
        autoCapitalize="none"
        returnKeyType="next"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        left={<TextInput.Icon icon="email" />}
      />
      <TextInput
        style={styles.textinput}
        label="Senha"
        placeholder="Digite sua senha"
        mode="outlined"
        autoCapitalize="none"
        returnKeyType="go"
        secureTextEntry
        onChangeText={(text) => setSenha(text)}
        left={<TextInput.Icon icon="key" />}
        right={
          <TextInput.Icon
            icon="eye"
            color={exibirSenha ? theme.colors.onBackground : theme.colors.error}
            onPress={() => setExibirSenha((previus) => !previus)}
          />
        }
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={entrar}
        labelStyle={{ color: theme.colors.onPrimary, fontSize: 16 }}
      >
        Entrar
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 30,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
    width: 200,
    alignSelf: "center",
  },
});
