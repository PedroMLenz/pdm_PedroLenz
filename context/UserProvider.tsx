import { app } from "@/firebase/firebaseInit";
import { Usuario } from "@/model/Usuario";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {
  const { userAuth, delAccount }: any = useContext(AuthContext);
  const [userFirebase, setUserFirebase] = useState<Usuario | null>(null);

  useEffect(() => {
    if (userAuth) {
      getUser();
    }
  }, [userAuth]);
  const firestore = getFirestore(app);

  //busca os detalhes do usuário
  async function getUser(): Promise<void> {
    try {
      if (!userAuth.user) {
        return;
      }
      const docSnap = await getDoc(
        doc(firestore, "usuarios", userAuth.user.uid)
      );
      if (docSnap.exists()) {
        let userData = docSnap.data();
        const usuario: Usuario = {
          uid: docSnap.id,
          email: userData.email,
          nome: userData.nome,
          urlFoto: userData.urlFoto,
        };
        setUserFirebase(usuario);
      }
    } catch (e) {
      console.error("UserProvider, getUser: " + e);
    }
  }

  async function update(usuario: Usuario): Promise<string> {
    try {
      await setDoc(doc(firestore, "usuarios", usuario.uid), {
        nome: usuario.nome,
        email: usuario.email,
        urlFoto: usuario.urlFoto,
      });
      setUserFirebase(usuario);
      return "ok";
    } catch (e) {
      console.error(e);
      return "Erro ao atualizar o usuário. Contate o suporte.";
    }
  }

  async function del(uid: string): Promise<string> {
    try {
      await deleteDoc(doc(firestore, "usuarios", uid));
      await delAccount(); //TODO: garantir que o login seja recente, menor que 5 minutos, segundo especificação do serviço Authentication
      return "ok";
      console.log("Conta excluída com sucesso.");
    } catch (e) {
      console.error(e);
      return "Erro ao excluir a conta. Contate o suporte.";
    }
  }

  return (
    <UserContext.Provider value={{ userFirebase, update, del }}>
      {children}
    </UserContext.Provider>
  );
};
