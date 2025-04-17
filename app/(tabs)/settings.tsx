import { SafeAreaView } from "react-native-safe-area-context";
import { Dialog, List, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function SettingsScreen() {
  const theme = useTheme();
  const { sair } = useContext<any>(AuthContext);
  const [dialogVisivel, setDialogVisivel] = useState(false);

  async function handleSair() {
    if (await sair()) {
      router.replace("/signIn");
    } else {
      setDialogVisivel(true);
    }
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <List.Section>
        <List.Subheader>Configurações</List.Subheader>
        <List.Item
          title="Perfil"
          description="Gerencie suas informações pessoais"
          left={(props) => <List.Icon {...props} icon="account" />}
          onPress={() => router.push("/profile")}
        />
        <List.Item
          title="Notificações"
          description="Gerencie suas preferências de notificação"
          left={(props) => <List.Icon {...props} icon="bell" />}
          onPress={() => alert("Navegar para Notificações")}
        />
        <List.Item
          title="Privacidade"
          description="Ajuste suas configurações de privacidade"
          left={(props) => <List.Icon {...props} icon="lock" />}
          onPress={() => alert("Navegar para Privacidade")}
        />
        <List.Item
          title="Sobre"
          description="Informações sobre o aplicativo"
          left={(props) => <List.Icon {...props} icon="information" />}
          onPress={() => alert("Navegar para Sobre")}
        />
        <List.Item
          title="Sair"
          description="Encerrar a sessão"
          left={(props) => <List.Icon {...props} icon="exit-to-app" />}
          onPress={handleSair}
        />
      </List.Section>
      <Dialog
        visible={dialogVisivel}
        onDismiss={() => {
          setDialogVisivel(false);
        }}
      >
        <Dialog.Icon icon={"alert-circle-outline"} size={60} />
        <Dialog.Title style={styles.textDialog}>'Ops!'</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {`Estamos com problemas para realizar essa operação.\nPor favor,
             contate o administrador.`}
          </Text>
        </Dialog.Content>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  textDialog: {
    textAlign: "center",
  },
});
