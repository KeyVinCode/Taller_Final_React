// src/components/auth/Login.jsx
import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../utils/supabaseClient';
import { AuthContext } from '../../context/AuthContext';

export class Login extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    
    this.state = {
      correo: "",
      contraseña: "",
      mostrarContraseña: false,
      cargando: false
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

  handleSubmit = async (e) => {
    e.preventDefault();
    
    const correo = this.state.correo.trim().toLowerCase();
    const contraseña = this.state.contraseña.trim();

    if (!correo || !contraseña) {
      toast.warn("⚠️ ¡Por favor llena todos los campos, granjero!");
      return;
    }

    this.setState({ cargando: true });

    try {
      // Usamos AuthContext para iniciar sesión y guardar el usuario
      const resultado = await this.context.iniciarSesion(correo, contraseña);

      if (resultado.success) {
        const usuario = resultado.usuario;

        toast.success(`👨‍🌾 ¡Bienvenido, ${usuario.display_name}!`);

        if (usuario.user_role === "admin") {
          this.props.navigate('/admin');
        } else {
          this.props.navigate('/shop');
        }
      } else {
        throw new Error(resultado.error);
      }
    } catch (error) {
      console.error("--- DETALLES COMPLETOS DEL ERROR DE AUTENTICACIÓN ---");
      console.dir(error);
      toast.error(`⚠️ Error de acceso: ${error.message}`);
    } finally {
      this.setState({ cargando: false });
    }
  };

  render() {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] relative">
        
        <Link 
          to="/" 
          className="absolute top-4 left-4 flex items-center gap-2 bg-[#fef3c7] hover:bg-[#fde68a] text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] font-stardewFont transition-all transform active:translate-y-0.5 active:shadow-none cursor-pointer z-20 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="bg-[#fef3c7] p-8 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] w-full max-w-md font-stardewFont mt-8">
            <h2 className="text-3xl font-bold text-center text-[#854d0e] mb-6 tracking-wide">
              Iniciar Sesión
            </h2>
            
            <form className="space-y-4" onSubmit={this.handleSubmit}>
              <div>
                <label className="block text-[#5c3a21] font-bold mb-1 text-sm">Correo Electrónico:</label>
                <input 
                  type="email" 
                  name="correo"
                  value={this.state.correo}
                  onChange={this.handleChange}
                  className="w-full p-2.5 rounded-xl border-2 border-[#854d0e] bg-white focus:outline-none" 
                  placeholder="granjero@valle.com"
                />
              </div>
              
              <div>
                <label className="block text-[#5c3a21] font-bold mb-1 text-sm">Contraseña:</label>
                <div className="relative flex items-center">
                  <input 
                    type={this.state.mostrarContraseña ? "text" : "password"} 
                    name="contraseña"
                    value={this.state.contraseña}
                    onChange={this.handleChange}
                    className="w-full p-2.5 pr-12 rounded-xl border-2 border-[#854d0e] bg-white focus:outline-none" 
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={this.toggleMostrarContraseña}
                    className="absolute right-3 text-[#854d0e] hover:text-[#a16207] cursor-pointer focus:outline-none"
                  >
                    {this.state.mostrarContraseña ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={this.state.cargando}
                className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] transition-all transform active:translate-y-0.5 active:shadow-none mt-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {this.state.cargando ? "Abriendo la reja..." : "Entrar a la Granja"}
              </button>
            </form>

            <p className="text-center text-sm text-[#5c3a21] font-semibold mt-6">
              ¿Eres nuevo en el valle?{' '}
              <Link to="/Registro" className="text-[#15803d] hover:underline font-bold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

// 3. Creamos el HOC para permitir la navegación en componentes de clase (React Router v6)
function withNavigation(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

// Exportamos el componente envuelto para que herede la propiedad 'navigate'
export default withNavigation(Login);