// src/pages/LandingPage.jsx
import React, { Component } from "react";
// Importación de los iconos temáticos necesarios
import { Apple, Hammer, Coins, ArrowRight } from "lucide-react";
// Importación del componente de clase Footer
import Footer from "../common/Footer";
import { Link } from "react-router-dom";

export class LandingPage extends Component {
  render() {
    return (
      <div className="min-h-screen flex flex-col font-stardewFont">
        {/* HERO SECTION - Fondo de cielo degradado de Stardew Valley */}
        <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 w-full bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] relative overflow-hidden">
          {/* Efecto decorativo de patrón de nubes en el fondo */}
          <div className="absolute inset-0 opacity-20 pointer-events-none select-none bg-[radial-gradient(#ffffff_20%,transparent_20%)] bg-[length:24px_24px]"></div>

          {/* Cartel Principal Estilo Cuadro de Diálogo */}
          <div className="bg-[#fef3c7] p-8 md:p-12 rounded-lg border-4 border-[#854d0e] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] max-w-2xl relative z-10 transition-transform hover:scale-[1.01]">
            <span className="inline-block bg-[#eab308] text-[#854d0e] font-bold px-3 py-1 rounded-full text-sm border-2 border-[#854d0e] mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
              ¡Nueva Temporada Disponible! 🌾
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-[#854d0e] mb-6 tracking-wide drop-shadow-[2px_2px_0px_rgba(254,243,199,1)]">
              Stardew Valley Shop
            </h1>

            <p className="text-[#5c3a21] text-lg mb-8 leading-relaxed font-semibold">
              Bienvenido a la sucursal oficial del valle. Aquí podrás gestionar
              tus herramientas, revisar el catálogo de semillas de Pierre y
              organizar los pedidos de la comunidad.
            </p>

            {/* Botones de Acción con efecto de presión activa */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/Login"
                className="flex items-center justify-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-6 rounded border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all text-center cursor-pointer"
              >
                Ingresar a la Tienda
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-[#fde68a] hover:bg-[#eab308] text-[#854d0e] font-bold py-3 px-6 rounded border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all transform active:translate-y-1 active:shadow-none cursor-pointer">
                Ver Catálogo
              </button>
            </div>
          </div>
        </header>

        {/* FEATURES SECTION - Tarjetas Redondeadas y Estilizadas */}
        <section className="bg-[#fde68a]/40 py-12 px-4 border-t-4 border-dashed border-[#854d0e]/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#854d0e] mb-10 uppercase tracking-wider">
              ¿Qué encontrarás en nuestro ecosistema?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tarjeta 1: Cultivos */}
              <div className="bg-white p-6 rounded-2xl border-4 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-transform">
                <div className="bg-[#fef3c7] p-3 rounded-xl w-fit border-2 border-[#854d0e] mb-4 text-[#15803d]">
                  <Apple className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#854d0e] mb-2">
                  Cultivos de Calidad
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitorea semillas, tiempos de riego y productos con estrellas
                  de calidad oro y plata.
                </p>
              </div>

              {/* Tarjeta 2: Herramientas */}
              <div className="bg-white p-6 rounded-2xl border-4 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-transform">
                <div className="bg-[#fef3c7] p-3 rounded-xl w-fit border-2 border-[#854d0e] mb-4 text-[#854d0e]">
                  <Hammer className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#854d0e] mb-2">
                  Herramientas
                </h3>
                <p className="text-gray-600 text-sm">
                  Controla el inventario de herramientas de la granja, desde
                  azadas de cobre hasta regaderas de iridio.
                </p>
              </div>

              {/* Tarjeta 3: Pedidos */}
              <div className="bg-white p-6 rounded-2xl border-4 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-transform">
                <div className="bg-[#fef3c7] p-3 rounded-xl w-fit border-2 border-[#854d0e] mb-4 text-[#eab308]">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#854d0e] mb-2">
                  Pedidos del Tablón
                </h3>
                <p className="text-gray-600 text-sm">
                  Asigna y gestiona las solicitudes especiales de los ciudadanos
                  de Pueblo Pelícano de manera eficiente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Instancia del componente de clase Footer */}
        <Footer />
      </div>
    );
  }
}

export default LandingPage;
