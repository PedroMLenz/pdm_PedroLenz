import { UserContext } from "@/context/UserProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, Text, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { Usuario } from "../model/Usuario";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object()
  .shape({
    nome: yup
      .string()
      .required(requiredMessage)
      .min(2, "O nome deve ter ao menos 2 caracteres"),
    email: yup
      .string()
      .required(requiredMessage)
      .matches(/\S+@\S+\.\S+/, "Email inválido"),
  })
  .required();

export default function Perfil({ navigation }: any) {
  const theme = useTheme();
  const { userFirebase }: any = useContext<any>(UserContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      nome: userFirebase.nome,
      email: userFirebase.email,
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
  const [requisitando, setRequisitando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
  const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", mensagem: "" });
  const { update, del }: any = useContext(UserContext);

  useEffect(() => {}, []);

  async function atualizaPerfil(data: Usuario) {
    setRequisitando(true);
    setAtualizando(true);
    data.uid = userFirebase.uid;
    data.urlFoto =
      "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
    const msg = await update(data);
    if (msg === "ok") {
      setMensagem({
        tipo: "ok",
        mensagem: "Show! Seu perfil foi atualizado com sucesso.",
      });
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    } else {
      setMensagem({ tipo: "erro", mensagem: msg });
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    }
  }

  function avisarDaExclusaoPermanenteDaConta() {
    console.log("excluir conta", userFirebase.uid);
    setDialogExcluirVisivel(true);
  }

  async function excluirConta() {
    console.log("excluir conta", userFirebase.uid);
    setDialogExcluirVisivel(false);
    setRequisitando(true);
    setExcluindo(true);
    const msg = await del(userFirebase.uid);
    if (msg === "ok") {
      router.replace("/signIn");
    } else {
      setMensagem({ tipo: "erro", mensagem: "ops! algo deu errado" });
      setDialogErroVisivel(true);
      setRequisitando(false);
      setExcluindo(false);
    }
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={
              userFirebase?.urlFoto
                ? { uri: userFirebase.urlFoto }
                : require("../assets/images/person.png")
            }
            loadingIndicatorSource={require("../assets/images/person.png")}
          />
          <View style={styles.divButtonsImage}>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="image"
              onPress={() =>
                alert(
                  "Isso será desenvolvido na branch modulo2_upload_imagen))"
                )
              }
            >
              Galeria
            </Button>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="camera"
              onPress={() =>
                alert(
                  "Isso será desenvolvido na branch modulo2_upload_imagen))"
                )
              }
            >
              Foto
            </Button>
          </View>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                label="Nome"
                placeholder="Digite seu nome completo"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="smart-card" />}
              />
            )}
            name="nome"
          />
          {errors.email && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.nome?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                disabled
                label="Email"
                placeholder="Digite seu email"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="next"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="email" />}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.email?.message?.toString()}
            </Text>
          )}

          <Button
            style={styles.button}
            mode="contained"
            onPress={handleSubmit(atualizaPerfil)}
            loading={requisitando}
            disabled={requisitando}
          >
            {!atualizando ? "Atualizar" : "Atualizando"}
          </Button>
          <Button
            style={styles.buttonOthers}
            mode="outlined"
            onPress={handleSubmit(avisarDaExclusaoPermanenteDaConta)}
            loading={requisitando}
            disabled={requisitando}
          >
            {!excluindo ? "Excluir" : "Excluindo"}
          </Button>
        </>
      </ScrollView>
      <Dialog
        visible={dialogExcluirVisivel}
        onDismiss={() => {
          setDialogErroVisivel(false);
        }}
        style={{
          backgroundColor: theme.dark ? "#051B31" : "#F1F1F1",
        }}
      >
        <Dialog.Icon icon={"alert-circle-outline"} size={60} color="#246BFD" />
        <Dialog.Title
          style={{ ...styles.textDialog, color: theme.colors.primary }}
        >
          {"Ops!"}
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={{ ...styles.textDialog, color: theme.colors.primary }}
            variant="bodyLarge"
          >
            {
              "Você tem certeza que deseja excluir sua conta?\nEsta operação será irreversível."
            }
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => setDialogExcluirVisivel(false)}
            textColor={theme.colors.primary}
          >
            Cancelar
          </Button>
          <Button onPress={excluirConta} textColor={theme.colors.error}>
            Excluir
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={dialogErroVisivel}
        onDismiss={() => {
          setDialogErroVisivel(false);
          if (mensagem.tipo === "ok") {
            router.back();
          }
        }}
        style={{
          backgroundColor: theme.dark ? "#051B31" : "#F1F1F1",
        }}
      >
        <Dialog.Icon
          icon={
            mensagem.tipo === "ok"
              ? "checkbox-marked-circle-outline"
              : "alert-circle-outline"
          }
          size={60}
          color="#246BFD"
        />
        <Dialog.Title
          style={{ ...styles.textDialog, color: theme.colors.primary }}
        >
          {mensagem.tipo === "ok" ? "Informação" : "Erro"}
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={{ ...styles.textDialog, color: theme.colors.primary }}
            variant="bodyLarge"
          >
            {mensagem.mensagem}
          </Text>
        </Dialog.Content>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 200 / 2,
    marginTop: 50,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: "transparent",
  },
  textEsqueceuSenha: {
    alignSelf: "flex-end",
    marginTop: 20,
  },
  textCadastro: {},
  textError: {
    width: 350,
  },
  button: {
    marginTop: 40,
  },
  buttonOthers: {
    marginTop: 20,
    marginBottom: 30,
  },
  divButtonsImage: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  buttonImage: {
    width: 180,
  },
  textDialog: {
    textAlign: "center",
  },
});
