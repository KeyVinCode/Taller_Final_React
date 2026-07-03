// src/components/admin/AdminGuard.jsx — Protege rutas para que solo admins accedan
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ShieldOff, Store } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

/**
 * AdminGuard: Solo renderiza el contenido si el usuario tiene rol "admin".
 * Si no está logueado o no es admin, muestra un mensaje de acceso denegado.
 */
export class AdminGuard extends Component {
  static contextType = AuthContext;

  render() {
    const { usuario, cargando } = this.context || {};

    // Mientras se verifica la sesión
    if (cargando) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex items-center justify-center font-stardewFont">
          <p className="text-xl font-bold text-[#854d0e] animate-pulse">
            Verificando acceso...
          </p>
        </div>
      );
    }

    // No está logueado o no es admin
    if (!usuario || usuario.user_role !== "admin") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex items-center justify-center font-stardewFont">
          <div className="bg-[#fef3c7] p-10 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center max-w-md mx-4">
            <ShieldOff className="w-20 h-20 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#854d0e] mb-2">
              Acceso Denegado
            </h2>
            <p className="text-[#5c3a21] mb-6">
              Esta sección es solo para administradores del Valle. Si eres
              administrador, inicia sesión con tu cuenta.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/Login"
                className="bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-6 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/shop"
                className="bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-3 px-6 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <Store className="w-4 h-4 inline mr-1" />
                Ir a la Tienda
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Es admin → renderiza el contenido (navbar + página)
    return <>{this.props.children}</>;
  }
}

export default AdminGuard;