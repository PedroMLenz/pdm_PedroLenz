import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Dialog, TextInput, useTheme } from "react-native-paper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseInit"; // Verifique se o caminho está correto

export default function RecuperarSenhaScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagemDialog, setMensagemDialog] = useState({
    tipo: "",
    mensagem: "",
  });

  async function handlePasswordReset() {
    if (!email) {
      setMensagemDialog({
        tipo: "erro",
        mensagem: "Por favor, insira um email válido.",
      });
      setDialogVisivel(true);
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMensagemDialog({
        tipo: "ok",
        mensagem:
          "Um email para redefinição de senha foi enviado. Verifique sua caixa de entrada.",
      });
      setEmail("");
    } catch (error: any) {
      setMensagemDialog({
        tipo: "erro",
        mensagem: error.message || "Ocorreu um erro ao enviar o email.",
      });
    } finally {
      setLoading(false);
      setDialogVisivel(true);
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{ ...styles.title, color: theme.colors.primary }}>
        Recuperar Senha
      </Text>
      <Text style={{ ...styles.subtitle, color: theme.colors.onBackground }}>
        Insira seu email para receber um link de redefinição de senha.
      </Text>
      <TextInput
        mode="outlined"
        label="Digite seu email"
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handlePasswordReset}
        loading={loading}
        disabled={loading}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        {!loading ? "Enviar Email" : "Enviando..."}
      </Button>
      <Dialog
        visible={dialogVisivel}
        onDismiss={() => setDialogVisivel(false)}
        style={{
          backgroundColor: theme.dark ? "#051B31" : "#F1F1F1",
        }}
      >
        <Dialog.Icon
          icon={
            mensagemDialog.tipo === "ok"
              ? "checkbox-marked-circle-outline"
              : "alert-circle-outline"
          }
          size={60}
          color="#246BFD"
        />
        <Dialog.Title
          style={{ ...styles.textDialog, color: theme.colors.primary }}
        >
          {mensagemDialog.tipo === "ok" ? "Informação" : "Erro"}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ ...styles.textDialog, color: theme.colors.primary }}>
            {mensagemDialog.mensagem}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => setDialogVisivel(false)}
            textColor={theme.colors.primary}
          >
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
  textDialog: {
    textAlign: "center",
  },
});
