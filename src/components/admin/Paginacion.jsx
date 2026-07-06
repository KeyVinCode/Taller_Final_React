// src/components/admin/Paginacion.jsx — Componente de paginación reutilizable
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Paginacion = ({ paginaActual, totalPaginas, onCambiarPagina }) => {
  if (totalPaginas <= 1) return null;

  // Calcular qué números de página mostrar
  const obtenerPaginasVisibles = () => {
    const paginas = [];
    const maxVisibles = 5;

    let inicio = Math.max(1, paginaActual - Math.floor(maxVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxVisibles - 1);

    if (fin - inicio + 1 < maxVisibles) {
      inicio = Math.max(1, fin - maxVisibles + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  };

  const paginasVisibles = obtenerPaginasVisibles();

  return (
    <div className="flex items-center justify-center gap-1 p-4 border-t-4 border-[#854d0e]/20">
      {/* Botón anterior */}
      <button
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual <= 1}
        className="flex items-center gap-1 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2 px-3 rounded-xl border-2 border-[#854d0e] text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Anterior
      </button>

      {/* Números de página */}
      {paginasVisibles.map((pagina) => (
        <button
          key={pagina}
          onClick={() => onCambiarPagina(pagina)}
          className={`min-w-[36px] py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
            pagina === paginaActual
              ? "bg-[#854d0e] text-[#fef3c7] border-[#854d0e] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
              : "bg-white hover:bg-gray-100 text-[#854d0e] border-[#854d0e]/40"
          }`}
        >
          {pagina}
        </button>
      ))}

      {/* Botón siguiente */}
      <button
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas}
        className="flex items-center gap-1 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2 px-3 rounded-xl border-2 border-[#854d0e] text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Siguiente
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Paginacion;