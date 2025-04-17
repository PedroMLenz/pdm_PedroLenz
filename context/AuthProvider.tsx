import { app } from "@/firebase/firebaseInit";
import { auth } from "@/firebase/firebaseInit";
import { Credential } from "@/model/type";
import * as SecureStore from "expo-secure-store";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
} from "firebase/auth";
import React, { createContext, useState } from "react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Usuario } from "@/model/Usuario";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [userAuth, setUserAuth] = useState<UserCredential | null>(null);
  const firestore = getFirestore(app);
  /*
    Cache criptografado do usuário
  */
  async function armazenaCredencialnaCache(
    credencial: Credential
  ): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        "credencial",
        JSON.stringify({
          email: credencial.email,
          senha: credencial.senha,
        })
      );
    } catch (e) {
      console.error("AuthProvider, armazenaCredencialnaCache: " + e);
    }
  }

  async function recuperaCredencialdaCache(): Promise<null | string> {
    try {
      const credencial = await SecureStore.getItemAsync("credencial");
      return credencial ? JSON.parse(credencial) : null;
    } catch (e) {
      console.error("AuthProvider, recuperaCredencialdaCache: " + e);
      return null;
    }
  }

  async function signUp(usuario: Usuario): Promise<string> {
    try {
      if (usuario.email && usuario.senha) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          usuario.email,
          usuario.senha
        );
        if (userCredential) {
          await sendEmailVerification(userCredential.user);
        }
        //A senha não deve ir para o Firestore
        const usuarioFirestore = {
          email: usuario.email,
          nome: usuario.nome,
          urlFoto: usuario.urlFoto,
        };
        await setDoc(
          doc(firestore, "usuarios", userCredential.user.uid),
          usuarioFirestore
        );
      } else {
        return "Email e senha são obrigatórios.";
      }
      return "ok";
    } catch (error: any) {
      console.error("Erro ao cadastrar", error.code, error.message);
      return launchServerMessageErro(error);
    }
  }

  async function signIn(credencial: Credential): Promise<string> {
    try {
      let userCredential = await signInWithEmailAndPassword(
        auth,
        credencial.email,
        credencial.senha
      );
      if (!userCredential.user.emailVerified) {
        return "Você precisa verificar seu email para continuar.";
      }
      setUserAuth(userCredential); // Adjusted to store the entire userCredential object
      armazenaCredencialnaCache(credencial);
      console.log("Atenticou", userCredential.user);
      return "ok";
    } catch (error: any) {
      console.error("Erro ao autenticar", error.code, error.message);
      return launchServerMessageErro(error);
    }
  }

  async function delAccount(): Promise<void> {
    console.log("deletando conta");
    if (userAuth?.user) {
      await deleteUser(userAuth.user);
    }
  }

  //função utilitária
  function launchServerMessageErro(e: any): string {
    switch (e.code) {
      case "auth/invalid-credential":
        return "Email inexistente ou senha errada.";
      case "auth/user-not-found":
        return "Usuário não cadastrado.";
      case "auth/wrong-password":
        return "Erro na senha.";
      case "auth/invalid-email":
        return "Email inexistente.";
      case "auth/user-disabled":
        return "Usuário desabilitado.";
      case "auth/email-already-in-use":
        return "Email em uso. Tente outro email.";
      default:
        return "Erro desconhecido. Contate o administrador";
    }
  }

  async function sair(): Promise<string> {
    try {
      await signOut(auth);
      return "ok";
    } catch (error: any) {
      console.error(error.code, error.message);
      return launchServerMessageErro(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        recuperaCredencialdaCache,
        userAuth,
        signUp,
        delAccount,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
