// src/components/admin/ClientList.jsx — Listado de clientes para administradores
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import { AuthContext } from "../../context/AuthContext";

export class ClientList extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      clientes: [],
      cargando: true,
      error: null,
      busqueda: "",
    };
  }

  componentDidMount() {
    this.cargarClientes();
  }

  cargarClientes = async () => {
    this.setState({ cargando: true, error: null });

    try {
      // Refrescar sesión de Supabase para que las políticas RLS funcionen
      await supabase.auth.getSession();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      this.setState({ clientes: data || [], cargando: false });
    } catch (error) {
      console.error("❌ Error al cargar clientes:", error.message);
      this.setState({ cargando: false, error: error.message });
    }
  };

  formatearFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    return new Date(fechaISO).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  handleBusqueda = (e) => {
    this.setState({ busqueda: e.target.value });
  };

  render() {
    const { clientes, cargando, error, busqueda } = this.state;

    // Filtrar clientes por búsqueda
    const clientesFiltrados = clientes.filter((c) => {
      const termino = busqueda.toLowerCase();
      return (
        c.display_name?.toLowerCase().includes(termino) ||
        c.email?.toLowerCase().includes(termino) ||
        c.user_role?.toLowerCase().includes(termino)
      );
    });

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col font-stardewFont">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
            {/* Encabezado */}
            <div className="p-6 border-b-4 border-[#854d0e]/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#15803d]/10 p-2.5 rounded-xl border border-[#15803d]/30">
                    <Users className="w-6 h-6 text-[#15803d]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#854d0e] tracking-wide">
                      Clientes Registrados
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {clientes.length} usuario(s) en total
                    </p>
                  </div>
                </div>

                {/* Buscador */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#854d0e]/60" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={this.handleBusqueda}
                    placeholder="Buscar cliente..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-[#854d0e] bg-white text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contenido */}
            {cargando ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-[#854d0e]/40 mx-auto mb-3 animate-pulse" />
                <p className="text-lg font-bold text-[#854d0e] animate-pulse">
                  Cargando clientes...
                </p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button
                  onClick={this.cargarClientes}
                  className="bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2 px-6 rounded-xl border-2 border-[#854d0e] transition-all cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-[#854d0e]/30 mx-auto mb-3" />
                <p className="text-lg font-bold text-[#5c3a21]">
                  {busqueda
                    ? "No se encontraron clientes con ese criterio"
                    : "No hay clientes registrados aún"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#fde68a]/50">
                      <th className="text-left p-4 font-bold text-[#854d0e]">
                        Usuario
                      </th>
                      <th className="text-left p-4 font-bold text-[#854d0e]">
                        Correo
                      </th>
                      <th className="text-left p-4 font-bold text-[#854d0e]">
                        Rol
                      </th>
                      <th className="text-left p-4 font-bold text-[#854d0e] hidden md:table-cell">
                        Fecha de registro
                      </th>
                      <th className="text-left p-4 font-bold text-[#854d0e] hidden md:table-cell">
                        ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#854d0e]/10">
                    {clientesFiltrados.map((cliente) => (
                      <tr
                        key={cliente.id}
                        className="hover:bg-[#fef3c7]/70 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#15803d] rounded-full flex items-center justify-center text-[#fef3c7] font-bold text-sm">
                              {cliente.display_name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="font-bold text-[#5c3a21]">
                              {cliente.display_name || "Sin nombre"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600">
                              {cliente.email || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              cliente.user_role === "admin"
                                ? "bg-[#eab308]/20 text-[#854d0e] border border-[#eab308]/50"
                                : "bg-[#15803d]/10 text-[#15803d] border border-[#15803d]/30"
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {cliente.user_role === "admin"
                              ? "Admin"
                              : "Cliente"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {this.formatearFecha(cliente.created_at)}
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-xs hidden md:table-cell font-mono">
                          #{cliente.id?.slice(0, 8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default ClientList;