// src/pages/CartPage.jsx
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Store,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react";
import { CartContext } from "../context/CartContext";

/**
 * Placeholder genérico cuando una imagen no carga
 */
const PLACEHOLDER_IMAGEN = "https://placehold.co/300x300/15803d/fef3c7?text=Stardew";

/**
 * Manejador de error para imágenes
 */
const manejarErrorImagen = (e) => {
  if (e.target.src !== PLACEHOLDER_IMAGEN) {
    e.target.src = PLACEHOLDER_IMAGEN;
  }
};

export class CartPage extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      totalItems: 0,
      totalPrecio: 0,
    };
  }

  componentDidMount() {
    this.sincronizarEstado();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.context) {
      const { items, totalItems, totalPrecio } = this.context;
      if (
        prevState.totalItems !== totalItems ||
        prevState.totalPrecio !== totalPrecio
      ) {
        this.sincronizarEstado();
      }
    }
  }

  sincronizarEstado = () => {
    if (this.context) {
      this.setState({
        items: this.context.items || [],
        totalItems: this.context.totalItems || 0,
        totalPrecio: this.context.totalPrecio || 0,
      });
    }
  };

  render() {
    const { items, totalItems, totalPrecio } = this.state;
    const carritoVacio = items.length === 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col font-stardewFont">
        {/* Encabezado */}
        <header className="bg-[#fef3c7] border-b-4 border-[#854d0e] p-4 sticky top-0 z-30 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-[#854d0e]" />
              <h1 className="text-2xl font-bold text-[#854d0e] tracking-wide">
                Carrito de Compras
              </h1>
            </div>

            <Link
              to="/shop"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Seguir comprando
            </Link>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          {carritoVacio ? (
            /* Estado vacío */
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <ShoppingBag className="w-20 h-20 text-[#854d0e]/40 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#854d0e] mb-2">
                ¡Tu carrito está vacío!
              </h2>
              <p className="text-[#5c3a21] mb-6">
                Parece que aún no has agregado productos del Valle.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg"
              >
                <Store className="w-5 h-5" />
                Ir a la Tienda
              </Link>
            </div>
          ) : (
            <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
              {/* Lista de Items */}
              <div className="divide-y-2 divide-[#854d0e]/20">
                {items.map((item) => (
                  <div
                    key={item.producto.id}
                    className="flex items-center gap-4 p-4 md:p-6"
                  >
                    {/* Imagen */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-[#15803d] rounded-xl border-2 border-[#854d0e] overflow-hidden flex-shrink-0">
                      <img
                        src={item.producto.imagen}
                        alt={item.producto.nombre}
                        className="w-full h-full object-cover"
                        onError={manejarErrorImagen}
                      />
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs bg-[#fef3c7] text-[#854d0e] font-bold px-2 py-0.5 rounded-md border border-[#854d0e]">
                        {item.producto.categoria}
                      </span>
                      <h3 className="text-lg font-bold text-[#5c3a21] mt-1 truncate">
                        {item.producto.nombre}
                      </h3>
                      <p className="text-sm font-black text-[#15803d]">
                        ${item.producto.precio} G c/u
                      </p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          this.context.quitarDelCarrito(item.producto.id)
                        }
                        className="bg-[#fde68a] hover:bg-[#eab308] text-[#854d0e] p-1.5 rounded-lg border-2 border-[#854d0e] transition-all active:translate-y-0.5 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="font-bold text-[#854d0e] text-lg w-8 text-center">
                        {item.cantidad}
                      </span>

                      <button
                        onClick={() =>
                          this.context.agregarAlCarrito(item.producto)
                        }
                        className="bg-[#fde68a] hover:bg-[#eab308] text-[#854d0e] p-1.5 rounded-lg border-2 border-[#854d0e] transition-all active:translate-y-0.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal y eliminar */}
                    <div className="text-right">
                      <p className="font-black text-[#15803d] text-lg">
                        ${item.producto.precio * item.cantidad} G
                      </p>
                      <button
                        onClick={() =>
                          this.context.eliminarDelCarrito(item.producto.id)
                        }
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-bold mt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen y totales */}
              <div className="bg-[#fde68a] p-6 border-t-4 border-[#854d0e]">
                <div className="max-w-md ml-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#854d0e] font-bold">
                      Productos ({totalItems} uds.):
                    </span>
                    <span className="font-bold text-[#5c3a21]">
                      ${totalPrecio} G
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#854d0e] font-bold">Envío:</span>
                    <span className="font-bold text-[#15803d]">Gratis 🎉</span>
                  </div>
                  <div className="border-t-2 border-[#854d0e]/40 pt-3 flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-[#854d0e]">
                      Total:
                    </span>
                    <span className="text-2xl font-black text-[#15803d]">
                      ${totalPrecio} G
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => this.context.vaciarCarrito()}
                      className="flex-1 bg-white hover:bg-gray-100 text-red-600 font-bold py-2.5 rounded-xl border-2 border-red-600 text-sm transition-all cursor-pointer"
                    >
                      Vaciar carrito
                    </button>
                    <button className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2.5 rounded-xl border-2 border-[#854d0e] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-sm cursor-pointer">
                      Pagar ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default CartPage;