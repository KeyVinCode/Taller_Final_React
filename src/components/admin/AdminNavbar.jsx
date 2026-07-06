// src/components/admin/AdminNavbar.jsx — Barra de navegación exclusiva para administradores
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Package,
  Users,
  LogOut,
  User,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export class AdminNavbar extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      menuAbierto: false,
    };
  }

  toggleMenu = () => {
    this.setState((prev) => ({ menuAbierto: !prev.menuAbierto }));
  };

  render() {
    const { menuAbierto } = this.state;
    const usuario = this.context?.usuario;

    // Solo se muestra si el usuario es admin
    if (!usuario || usuario.user_role !== "admin") return null;

    return (
      <nav className="bg-[#854d0e] border-b-4 border-[#5c3a21] shadow-md sticky top-0 z-50 font-stardewFont">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo y título */}
            <Link
              to="/admin"
              className="flex items-center gap-2 text-[#fef3c7] font-bold hover:text-[#fde68a] transition-colors"
            >
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-lg tracking-wide hidden md:inline">
                Admin Valle
              </span>
            </Link>

            {/* Enlaces de escritorio */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink
                to="/admin"
                icon={<LayoutDashboard className="w-4 h-4" />}
                texto="Dashboard"
              />
              <NavLink
                to="/admin/pedidos"
                icon={<ShoppingCart className="w-4 h-4" />}
                texto="Pedidos"
              />
              <NavLink
                to="/admin/productos"
                icon={<Package className="w-4 h-4" />}
                texto="Productos"
              />
              <NavLink
                to="/admin/clientes"
                icon={<Users className="w-4 h-4" />}
                texto="Clientes"
              />

              <div className="w-px h-6 bg-[#fef3c7]/30 mx-2"></div>

              <Link
                to="/shop"
                className="flex items-center gap-1.5 text-[#fef3c7] hover:bg-[#5c3a21] px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
              >
                <Store className="w-4 h-4" />
                Tienda
              </Link>
            </div>

            {/* Usuario y cerrar sesión (escritorio) */}
            <div className="hidden md:flex items-center gap-1">
              <span className="flex items-center gap-1.5 text-[#fef3c7] hover:bg-[#5c3a21] px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                <User className="w-4 h-4" />
                {usuario.display_name}
              </span>
              <button
                onClick={() => this.context.cerrarSesion()}
                className="flex items-center gap-1.5 text-[#fef3c7] hover:bg-red-700/50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={this.toggleMenu}
              className="md:hidden text-[#fef3c7] p-2 cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuAbierto ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Menú móvil desplegable */}
          {menuAbierto && (
            <div className="md:hidden pb-3 border-t border-[#fef3c7]/20 pt-2">
              <MobileNavLink
                to="/admin"
                icon={<LayoutDashboard className="w-4 h-4" />}
                texto="Dashboard"
                onClick={this.toggleMenu}
              />
              <MobileNavLink
                to="/admin/pedidos"
                icon={<ShoppingCart className="w-4 h-4" />}
                texto="Pedidos"
                onClick={this.toggleMenu}
              />
              <MobileNavLink
                to="/admin/productos"
                icon={<Package className="w-4 h-4" />}
                texto="Productos"
                onClick={this.toggleMenu}
              />
              <MobileNavLink
                to="/admin/clientes"
                icon={<Users className="w-4 h-4" />}
                texto="Clientes"
                onClick={this.toggleMenu}
              />
              <div className="border-t border-[#fef3c7]/20 my-2"></div>
              <MobileNavLink
                to="/shop"
                icon={<Store className="w-4 h-4" />}
                texto="Ir a la Tienda"
                onClick={this.toggleMenu}
              />
              <button
                onClick={() => {
                  this.context.cerrarSesion();
                  this.toggleMenu();
                }}
                className="flex items-center gap-2 w-full text-left text-[#fef3c7] hover:bg-[#5c3a21] px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
              <p className="flex items-center gap-1.5 text-sm text-[#fef3c7]/70 px-3 pt-2 font-bold">
                <User className="w-4 h-4" />
                {usuario.display_name}
              </p>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

/**
 * Componente de enlace del navbar (escritorio)
 */
function NavLink({ to, icon, texto }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 text-[#fef3c7] hover:bg-[#5c3a21] px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
    >
      {icon}
      {texto}
    </Link>
  );
}

/**
 * Componente de enlace del navbar (móvil)
 */
function MobileNavLink({ to, icon, texto, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 text-[#fef3c7] hover:bg-[#5c3a21] px-3 py-2 rounded-lg text-sm font-bold transition-colors"
    >
      {icon}
      {texto}
    </Link>
  );
}

export default AdminNavbar;