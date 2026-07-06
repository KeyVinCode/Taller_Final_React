// src/pages/NotFoundPage.jsx — Página de error con detección de código específico
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ShieldOff,
  SearchX,
  Lock,
  Home,
  Store,
  ArrowLeft,
} from "lucide-react";

/**
 * Mapas de códigos de error a configuraciones visuales
 */
const ERRORES = {
  400: {
    icono: SearchX,
    titulo: "Solicitud Incorrecta",
    descripcion: "El servidor no pudo entender la solicitud. Verifica los datos ingresados.",
    color: "text-[#eab308]",
    bg: "bg-[#fef3c7]",
  },
  401: {
    icono: Lock,
    titulo: "No Autorizado",
    descripcion: "Necesitas iniciar sesión para acceder a esta sección del Valle.",
    color: "text-[#eab308]",
    bg: "bg-[#fef3c7]",
  },
  403: {
    icono: ShieldOff,
    titulo: "Acceso Denegado",
    descripcion: "No tienes permisos suficientes para entrar aquí. Esta área es solo para administradores.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  404: {
    icono: SearchX,
    titulo: "Página No Encontrada",
    descripcion: "El camino que buscas no existe en este valle. Puede que la página haya sido movida o eliminada.",
    color: "text-[#854d0e]",
    bg: "bg-[#fef3c7]",
  },
  500: {
    icono: ShieldOff,
    titulo: "Error del Servidor",
    descripcion: "Algo salió mal en el servidor. Por favor, intenta de nuevo más tarde.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

/**
 * Analiza el mensaje de error y determina el código HTTP más apropiado
 */
const detectarError = (mensaje) => {
  const m = (mensaje || "").toLowerCase();

  if (m.includes("401") || m.includes("no autorizado") || m.includes("not authenticated") || m.includes("no hay sesión")) {
    return 401;
  }
  if (m.includes("403") || m.includes("denegado") || m.includes("no tienes permisos") || m.includes("forbidden") || m.includes("row level security")) {
    return 403;
  }
  if (m.includes("400") || m.includes("bad request") || m.includes("solicitud incorrecta")) {
    return 400;
  }
  if (m.includes("500") || m.includes("internal server") || m.includes("error del servidor")) {
    return 500;
  }
  // Por defecto 404
  return 404;
};

export class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigoError: null,
      mensajeError: null,
    };
  }

  componentDidMount() {
    // Intentar detectar el error desde state de la navegación o URL
    const estado = this.props.location?.state;
    const searchParams = new URLSearchParams(this.props.location?.search || "");
    const errorCode = searchParams.get("error") || estado?.errorCode;
    const errorMsg = estado?.errorMessage || null;

    if (errorCode) {
      this.setState({
        codigoError: parseInt(errorCode) || 404,
        mensajeError: errorMsg,
      });
    } else {
      this.setState({ codigoError: 404 });
    }
  }

  render() {
    const { codigoError, mensajeError } = this.state;
    const codigo = codigoError || 404;
    const error = ERRORES[codigo] || ERRORES[404];
    const Icono = error.icono;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex items-center justify-center font-stardewFont p-4">
        <div className={`${error.bg} p-10 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center max-w-lg mx-auto`}>
          {/* Código de error grande */}
          <div className="mb-2">
            <span className="text-8xl font-black text-[#854d0e]/20 select-none">
              {codigo}
            </span>
          </div>

          {/* Icono del error */}
          <div className="relative -mt-16 mb-4">
            <Icono className={`w-20 h-20 ${error.color} mx-auto`} />
          </div>

          {/* Título y descripción */}
          <h2 className="text-2xl font-bold text-[#854d0e] mb-2">
            {error.titulo}
          </h2>
          <p className="text-[#5c3a21] mb-2">
            {error.descripcion}
          </p>

          {/* Mensaje de error adicional (técnico) */}
          {mensajeError && (
            <div className="bg-[#854d0e]/10 border border-[#854d0e]/30 rounded-xl p-3 mb-4">
              <p className="text-xs text-[#5c3a21] font-mono break-all">
                {mensajeError}
              </p>
            </div>
          )}

          {/* Acciones según el tipo de error */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-6 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Home className="w-4 h-4" />
              Ir al Inicio
            </Link>

            {codigo === 401 && (
              <Link
                to="/Login"
                className="flex items-center justify-center gap-2 bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-3 px-6 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <Lock className="w-4 h-4" />
                Iniciar Sesión
              </Link>
            )}

            {codigo === 403 && (
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-3 px-6 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <Store className="w-4 h-4" />
                Ir a la Tienda
              </Link>
            )}

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-3 px-6 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Función para redirigir a la página de error con un código específico.
 * Útil para usar desde cualquier componente.
 */
export const redirigirError = (navigate, codigo, mensaje) => {
  const params = new URLSearchParams();
  params.set("error", codigo.toString());
  if (mensaje) params.set("msg", mensaje);
  navigate(`/error?${params.toString()}`);
};

export default NotFoundPage;