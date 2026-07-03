// src/pages/Registro.jsx
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
// Cambia la línea 6 de tu archivo src/components/auth/Register.jsx por esta:
import { supabase } from "../../utils/supabaseClient.js";

export class Register extends Component {
  constructor(props) {
    super(props);

    // 1. El rol ahora es interno y por defecto siempre será 'cliente'
    this.state = {
      Nombre: "",
      correo: "",
      contraseña: "",
      rol: "cliente", 
      mostrarContraseña: false,
      cargando: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggleMostrarContraseña = () => {
    this.setState((prevState) => ({
      mostrarContraseña: !prevState.mostrarContraseña,
    }));
  };

  validarFormulario = () => {
    const { Nombre, correo, contraseña } = this.state;
    return Nombre.trim() !== "" && correo.trim() !== "" && contraseña.trim() !== "";
  };

  limpiarFormulario = () => {
    // Mantenemos el rol por defecto al limpiar
    this.setState({ Nombre: "", correo: "", contraseña: "", rol: "cliente" });
  };

  /**
   * Inserta manualmente el perfil del usuario en la tabla pública 'profiles'.
   * Esto respalda al trigger automático de Supabase por si no se ejecuta.
   */
  insertarPerfilEnBD = async (userId, email, displayName, rol) => {
    try {
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        email: email,
        display_name: displayName,
        user_role: rol,
      });

      if (error) {
        // Si el error es que el perfil ya existe (lo creó el trigger), no pasa nada
        if (!error.message?.includes("duplicate key")) {
          console.warn("⚠️ No se pudo insertar perfil manualmente:", error.message);
        }
      }
    } catch (err) {
      console.warn("⚠️ Error al insertar perfil:", err.message);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validarFormulario()) {
      toast.warn("⚠️ ¡Por favor llena todos los campos, granjero!");
      return;
    }

    this.setState({ cargando: true });

    try {
      // 1. Registramos al usuario en Supabase Auth con metadata (display_name y user_role)
      const { data, error } = await supabase.auth.signUp({
        email: this.state.correo,
        password: this.state.contraseña,
        options: {
          data: {
            display_name: this.state.Nombre,
            user_role: this.state.rol,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // 2. Insertamos manualmente el perfil en la tabla pública 'profiles'
        await this.insertarPerfilEnBD(
          data.user.id,
          this.state.correo,
          this.state.Nombre,
          this.state.rol
        );

        // 3. Verificamos el estado del registro
        if (data.user.identities && data.user.identities.length === 0) {
          toast.error("⚠️ Este correo ya está registrado. Intenta iniciar sesión.");
        } else if (data.session === null) {
          toast.success(
            "✅ ¡Registro exitoso! Revisa tu bandeja de entrada y confirma tu correo antes de iniciar sesión.",
            { autoClose: 6000 }
          );
        } else {
          toast.success("🎉 ¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
        }
        this.limpiarFormulario();
      }
    } catch (error) {
      console.error("Error al registrar:", error.message);

      if (error.message?.includes("already registered")) {
        toast.error("⚠️ Este correo ya está registrado. Intenta iniciar sesión.");
      } else if (error.message?.includes("weak_password")) {
        toast.error("🔐 La contraseña es demasiado débil. Usa al menos 6 caracteres.");
      } else if (error.message?.includes("rate_limit")) {
        toast.error("⏳ Demasiados intentos. Espera un momento y vuelve a intentar.");
      } else {
        toast.error(`⚠️ Error: ${error.message}`);
      }
    } finally {
      this.setState({ cargando: false });
    }
  };

  renderVolver() {
    return (
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 bg-[#fef3c7] hover:bg-[#fde68a] text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] font-stardewFont transition-all transform active:translate-y-0.5 active:shadow-none cursor-pointer z-20 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Inicio
      </Link>
    );
  }

  renderCampoNombre() {
    return (
      <div>
        <label className="block text-[#5c3a21] font-bold mb-1 text-sm">
          Nombre del Granjero:
        </label>
        <input
          type="text"
          name="Nombre"
          value={this.state.Nombre}
          onChange={this.handleChange}
          className="w-full p-2.5 rounded-xl border-2 border-[#854d0e] bg-white focus:outline-none"
          placeholder="Ej. Pedro"
        />
      </div>
    );
  }

  renderCampoCorreo() {
    return (
      <div>
        <label className="block text-[#5c3a21] font-bold mb-1 text-sm">
          Correo Electrónico:
        </label>
        <input
          type="email"
          name="correo"
          value={this.state.correo}
          onChange={this.handleChange}
          className="w-full p-2.5 rounded-xl border-2 border-[#854d0e] bg-white focus:outline-none"
          placeholder="tu-correo@valle.com"
        />
      </div>
    );
  }

  renderCampoContraseña() {
    const { mostrarContraseña, contraseña } = this.state;

    return (
      <div>
        <label className="block text-[#5c3a21] font-bold mb-1 text-sm">
          Contraseña:
        </label>
        <div className="relative flex items-center">
          <input
            type={mostrarContraseña ? "text" : "password"}
            name="contraseña"
            value={contraseña}
            onChange={this.handleChange}
            className="w-full p-2.5 pr-12 rounded-xl border-2 border-[#854d0e] bg-white focus:outline-none"
            placeholder="Mínimo 6 caracteres"
          />
          <button
            type="button"
            onClick={this.toggleMostrarContraseña}
            className="absolute right-3 text-[#854d0e] hover:text-[#a16207] cursor-pointer focus:outline-none"
          >
            {mostrarContraseña ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] relative">
        {this.renderVolver()}

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="bg-[#fef3c7] p-8 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] w-full max-w-md font-stardewFont mt-8">
            <h2 className="text-3xl font-bold text-center text-[#854d0e] mb-6 tracking-wide">
              Nuevo Registro
            </h2>

            <form className="space-y-4" onSubmit={this.handleSubmit}>
              {this.renderCampoNombre()}
              {this.renderCampoCorreo()}
              {/* El campo de selección de rol ha sido removido con éxito para proteger el sistema */}
              {this.renderCampoContraseña()}

              <button
                type="submit"
                disabled={this.state.cargando}
                className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-3 px-4 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] transition-all transform active:translate-y-0.5 active:shadow-none mt-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {this.state.cargando ? "Guardando..." : "Crear Cuenta"}
              </button>
            </form>

            <p className="text-center text-sm text-[#5c3a21] font-semibold mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/Login"
                className="text-[#15803d] hover:underline font-bold"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;