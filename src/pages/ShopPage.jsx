// src/pages/ShopPage.jsx
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Store, ArrowLeft } from "lucide-react";
// Importamos Axios de forma limpia para el consumo de la API externa
import axios from "axios";

export class ShopPage extends Component {
  constructor(props) {
    super(props);

    // Estado inicial de la página de la tienda
    this.state = {
      productos: [],
      cargando: true,
      itemsEnCarrito: 0, // Control temporal del contador del carrito
    };
  }

  componentDidMount() {
    // Iniciamos el consumo de la API externa usando Axios al cargar la página
    this.cargarProductosDesdeAPI();
  }

  // Método asíncronico para obtener el catálogo de productos remotos
  // Reemplaza este método en tu ShopPage.jsx
  cargarProductosDesdeAPI = async () => {
    // PEGA AQUÍ TU NUEVA URL DEL GIST RAW
    const URL_API =
      "https://gist.githubusercontent.com/KeyVinCode/58157ab9d21609f9b85f0bd327109da9/raw/29b60ddcb6aa29f611d78b5f9a384ac38a46f54c/productos.json";

    try {
      const respuesta = await axios.get(URL_API);

      this.setState({
        productos: respuesta.data, // Como tu JSON ya tiene los nombres, no hace falta mapear
        cargando: false,
      });
    } catch (error) {
      console.error("❌ Error al conectar con tu API propia:", error.message);
      this.setState({ productos: [], cargando: false });
    }
  };
  renderHeader() {
    return (
      <header className="bg-[#fef3c7] border-b-4 border-[#854d0e] p-4 sticky top-0 z-30 font-stardewFont shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Título y Logotipo de la Tienda */}
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-[#854d0e]" />
            <h1 className="text-2xl font-bold text-[#854d0e] tracking-wide">
              Mercado del Valle
            </h1>
          </div>

          {/* Acciones del Encabezado */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>

            {/* Botón del Carrito con Contador */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] transition-all transform active:translate-y-0.5 active:shadow-none"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Carrito</span>
              {this.state.itemsEnCarrito > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center border-2 border-white">
                  {this.state.itemsEnCarrito}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  render() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col">
        {/* Renderizado de la barra superior */}
        {this.renderHeader()}

        {/* Contenedor principal del Catálogo */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 font-stardewFont">
          <div className="bg-[#fef3c7] p-6 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
            <h2 className="text-3xl font-bold text-[#854d0e] mb-6 border-b-2 border-[#854d0e] pb-2 tracking-wide">
              Catálogo de Productos
            </h2>

            {this.state.cargando ? (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-[#854d0e] animate-pulse">
                  🚜 Cargando los productos de la cosecha...
                </p>
              </div>
            ) : (
              /* CORRECCIÓN: Renderizamos la grilla de tarjetas de forma local sin usar ProductList externo */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {this.state.productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="bg-white border-4 border-[#854d0e] rounded-2xl p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Contenedor de la Imagen */}
                      <div className="w-full h-32 bg-[#bfdbfe] rounded-xl border-2 border-[#854d0e] overflow-hidden flex items-center justify-center mb-3">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="h-full w-full object-cover"
                          // ¡Aquí está la magia! Cambiamos via.placeholder.com por placehold.co
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/150x150/854d0e/fef3c7?text=Sin+Imagen";
                          }}
                        />
                      </div>

                      {/* Categoría y Nombre */}
                      <span className="text-xs bg-[#fef3c7] text-[#854d0e] font-bold px-2 py-0.5 rounded-md border border-[#854d0e]">
                        {producto.categoria}
                      </span>
                      <h3 className="text-lg font-bold text-[#5c3a21] mt-2 mb-1">
                        {producto.nombre}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        Stock disponible: {producto.stock} uds.
                      </p>
                    </div>

                    {/* Precio y Botón de Acción */}
                    <div className="mt-4 border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 font-bold">
                          Precio:
                        </span>
                        <span className="text-md font-black text-[#15803d]">
                          ${producto.precio} G
                        </span>
                      </div>
                      <button className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-1.5 rounded-xl border-2 border-[#854d0e] text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none transition-all">
                        Añadir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default ShopPage;
