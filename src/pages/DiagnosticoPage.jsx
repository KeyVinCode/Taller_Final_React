import React, { Component } from "react";
import { supabase } from "../utils/supabaseClient";
import { restaurarSesion } from "../utils/sessionHelper";

export class DiagnosticoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultados: [],
      ejecutando: false,
    };
  }

  agregarLog = (mensaje, tipo = "info") => {
    this.setState((prev) => ({
      resultados: [...prev.resultados, { mensaje, tipo, hora: new Date().toLocaleTimeString() }],
    }));
  };

  ejecutarDiagnostico = async () => {
    this.setState({ resultados: [], ejecutando: true });
    this.agregarLog("🔍 INICIANDO DIAGNÓSTICO...", "titulo");

    // 1. Verificar localStorage
    this.agregarLog("📦 Verificando localStorage...", "subtitulo");
    const stardewUser = localStorage.getItem("stardew_usuario");
    if (stardewUser) {
      try {
        const parsed = JSON.parse(stardewUser);
        this.agregarLog(`✅ stardew_usuario: ${parsed.display_name} (${parsed.user_role})`);
      } catch {
        this.agregarLog("❌ stardew_usuario: formato inválido");
      }
    } else {
      this.agregarLog("❌ stardew_usuario: no encontrado");
    }

    // Buscar clave de Supabase
    const sbKey = Object.keys(localStorage).find(k => k.startsWith("sb-") && k.endsWith("-auth-token"));
    if (sbKey) {
      this.agregarLog(`✅ Token Supabase encontrado: ${sbKey}`);
      try {
        const token = JSON.parse(localStorage.getItem(sbKey));
        this.agregarLog(`   Access token: ${token?.access_token?.slice(0, 20)}...`);
      } catch {}
    } else {
      this.agregarLog("❌ Token Supabase NO encontrado en localStorage");
    }

    // 2. Restaurar sesión
    this.agregarLog("🔄 Restaurando sesión...", "subtitulo");
    const restaurada = await restaurarSesion(supabase);
    if (restaurada) {
      this.agregarLog("✅ Sesión restaurada correctamente");
    } else {
      this.agregarLog("❌ No se pudo restaurar la sesión");
    }

    // 3. Verificar usuario autenticado
    this.agregarLog("👤 Verificando autenticación...", "subtitulo");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        this.agregarLog(`✅ Usuario autenticado: ${user.email} (ID: ${user.id?.slice(0, 8)}...)`);
      } else {
        this.agregarLog("❌ No hay usuario autenticado en Supabase");
      }
    } catch (e) {
      this.agregarLog(`❌ Error getUser: ${e.message}`);
    }

    // 4. Consultar profiles
    this.agregarLog("📋 Consultando tabla profiles...", "subtitulo");
    try {
      const { data, error } = await supabase.from("profiles").select("id, display_name, email, user_role");
      if (error) {
        this.agregarLog(`❌ Error: ${error.message} (${error.code})`);
      } else if (!data || data.length === 0) {
        this.agregarLog("⚠️ profiles: 0 registros (vacía o RLS bloquea)");
      } else {
        this.agregarLog(`✅ profiles: ${data.length} registros`);
        data.forEach((p) => {
          this.agregarLog(`   - ${p.display_name || "Sin nombre"} | ${p.email || "Sin email"} | Rol: ${p.user_role}`);
        });
      }
    } catch (e) {
      this.agregarLog(`❌ Error inesperado: ${e.message}`);
    }

    // 5. Consultar orders
    this.agregarLog("📋 Consultando tabla orders...", "subtitulo");
    try {
      const { data, error } = await supabase.from("orders").select("id, usuario_id, total_precio, estado, created_at");
      if (error) {
        this.agregarLog(`❌ Error: ${error.message} (${error.code})`);
      } else if (!data || data.length === 0) {
        this.agregarLog("⚠️ orders: 0 registros (vacía o RLS bloquea)");
      } else {
        this.agregarLog(`✅ orders: ${data.length} registros`);
        data.forEach((o) => {
          this.agregarLog(`   - #${o.id?.slice(0, 8)} | Usuario: ${o.usuario_id?.slice(0, 8)} | $${o.total_precio} | ${o.estado}`);
        });
      }
    } catch (e) {
      this.agregarLog(`❌ Error inesperado: ${e.message}`);
    }

    this.agregarLog("=".repeat(40), "titulo");
    this.agregarLog("✅ DIAGNÓSTICO COMPLETADO", "exito");
    this.setState({ ejecutando: false });
  };

  render() {
    const { resultados, ejecutando } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] p-8 font-mono">
        <div className="max-w-3xl mx-auto bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
          <h1 className="text-2xl font-bold text-[#854d0e] mb-4">🔍 Diagnóstico Supabase</h1>

          <button
            onClick={this.ejecutarDiagnostico}
            disabled={ejecutando}
            className="bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2 px-6 rounded-xl border-2 border-[#854d0e] disabled:opacity-50 cursor-pointer mb-6"
          >
            {ejecutando ? "Ejecutando..." : "▶ Ejecutar diagnóstico"}
          </button>

          <div className="bg-black text-green-400 p-4 rounded-xl text-xs leading-relaxed max-h-96 overflow-y-auto">
            {resultados.length === 0 ? (
              <p className="text-gray-500 italic">Presiona "Ejecutar diagnóstico" para comenzar...</p>
            ) : (
              resultados.map((r, i) => (
                <p key={i} className={
                  r.tipo === "titulo" ? "text-yellow-300 font-bold mt-2" :
                  r.tipo === "subtitulo" ? "text-cyan-300 font-bold mt-1" :
                  r.tipo === "exito" ? "text-green-300 font-bold" :
                  r.mensaje.startsWith("✅") ? "text-green-300" :
                  r.mensaje.startsWith("❌") ? "text-red-300" :
                  r.mensaje.startsWith("⚠️") ? "text-yellow-300" :
                  "text-green-400"
                }>
                  {r.mensaje}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DiagnosticoPage;