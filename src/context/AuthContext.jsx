// src/context/AuthContext.jsx
import React, { Component, createContext } from "react";
import { supabase } from "../utils/supabaseClient";

export const AuthContext = createContext();

const STORAGE_KEY = "stardew_usuario";

/**
 * Carga el usuario desde localStorage
 */
const cargarUsuarioStorage = () => {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (datos) return JSON.parse(datos);
  } catch (e) {
    console.warn("Error al cargar usuario del localStorage:", e);
  }
  return null;
};

/**
 * Guarda el usuario en localStorage
 */
const guardarUsuarioStorage = (usuario) => {
  try {
    if (usuario) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.warn("Error al guardar usuario en localStorage:", e);
  }
};

export class AuthProvider extends Component {
  constructor(props) {
    super(props);

    const usuarioGuardado = cargarUsuarioStorage();

    this.state = {
      usuario: usuarioGuardado, // { id, email, display_name, user_role }
      cargando: false,
    };
  }

  /**
   * Inicia sesión y guarda los datos del usuario (incluyendo nombre y rol)
   */
  iniciarSesion = async (email, password) => {
    this.setState({ cargando: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Obtener datos del perfil desde la tabla profiles
        const { data: perfil } = await supabase
          .from("profiles")
          .select("display_name, user_role")
          .eq("id", data.user.id)
          .single();

        const usuario = {
          id: data.user.id,
          email: data.user.email,
          display_name: perfil?.display_name || data.user.user_metadata?.display_name || "Granjero",
          user_role: perfil?.user_role || data.user.user_metadata?.user_role || "cliente",
        };

        guardarUsuarioStorage(usuario);
        this.setState({ usuario, cargando: false });
        return { success: true, usuario };
      }
    } catch (error) {
      this.setState({ cargando: false });
      return { success: false, error: error.message };
    }

    this.setState({ cargando: false });
    return { success: false, error: "No se pudo iniciar sesión" };
  };

  /**
   * Cierra sesión y limpia los datos del usuario
   */
  cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Error al cerrar sesión:", e);
    }
    guardarUsuarioStorage(null);
    this.setState({ usuario: null });
  };

  /**
   * Verifica si hay una sesión activa al cargar la app
   */
  verificarSesion = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: perfil } = await supabase
          .from("profiles")
          .select("display_name, user_role")
          .eq("id", data.session.user.id)
          .single();

        const usuario = {
          id: data.session.user.id,
          email: data.session.user.email,
          display_name: perfil?.display_name || "Granjero",
          user_role: perfil?.user_role || "cliente",
        };

        guardarUsuarioStorage(usuario);
        this.setState({ usuario });
      }
    } catch (e) {
      console.warn("Error al verificar sesión:", e);
    }
  };

  render() {
    const { usuario, cargando } = this.state;

    return (
      <AuthContext.Provider
        value={{
          usuario,
          cargando,
          iniciarSesion: this.iniciarSesion,
          cerrarSesion: this.cerrarSesion,
          verificarSesion: this.verificarSesion,
          estaLogueado: usuario !== null,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;