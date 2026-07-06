// src/context/AuthContext.jsx
import React, { Component, createContext } from "react";
import { supabase } from "../utils/supabaseClient";
import { restaurarSesion } from "../utils/sessionHelper";

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
      cargando: usuarioGuardado !== null, // Si hay usuario en storage, empezar verificando
    };
  }

  componentDidMount() {
    this.verificarSesion();

    // Escuchar cambios de autenticación en tiempo real
    this._authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        guardarUsuarioStorage(null);
        this.setState({ usuario: null, cargando: false });
      } else if (event === 'SIGNED_IN' && session) {
        // Si es SIGNED_IN pero no tenemos usuario en state, recargar datos
        if (!this.state.usuario) {
          this.recargarUsuario(session);
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refrescado, verificar si necesitamos actualizar datos
        if (this.state.usuario) {
          this.setState({ cargando: false });
        }
      }
    });
  }

  componentWillUnmount() {
    // Limpiar listener al desmontar
    if (this._authListener?.data?.subscription) {
      this._authListener.data.subscription.unsubscribe();
    }
  }

  /**
   * Recarga los datos del usuario desde la sesión
   */
  recargarUsuario = async (session) => {
    try {
      const { data: perfil } = await supabase
        .from("profiles")
        .select("display_name, user_role")
        .eq("id", session.user.id)
        .single();

      const usuario = {
        id: session.user.id,
        email: session.user.email,
        display_name: perfil?.display_name || "Granjero",
        user_role: perfil?.user_role || "cliente",
      };

      guardarUsuarioStorage(usuario);
      this.setState({ usuario, cargando: false });
    } catch (e) {
      console.warn("Error al recargar usuario:", e);
      this.setState({ cargando: false });
    }
  };

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
      // Usar el helper para restaurar la sesión (busca en múltiples lugares)
      const sesionRestaurada = await restaurarSesion(supabase);

      if (sesionRestaurada) {
        // Obtener los datos del usuario desde la sesión recién restaurada
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: perfil } = await supabase
            .from("profiles")
            .select("display_name, user_role")
            .eq("id", session.user.id)
            .single();

          const usuario = {
            id: session.user.id,
            email: session.user.email,
            display_name: perfil?.display_name || "Granjero",
            user_role: perfil?.user_role || "cliente",
          };

          guardarUsuarioStorage(usuario);
          this.setState({ usuario, cargando: false });
          return;
        }
      }

      // No hay sesión activa, limpiar estado
      guardarUsuarioStorage(null);
      this.setState({ usuario: null, cargando: false });
    } catch (e) {
      console.warn("Error al verificar sesión:", e);
      this.setState({ cargando: false });
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