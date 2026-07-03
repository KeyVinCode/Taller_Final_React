// src/pages/ShopPage.jsx
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Store,
  ArrowLeft,
  ChevronDown,
  X,
} from "lucide-react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const PRODUCTOS_POR_PAGINA = 8;

/**
 * Tasa de cambio: 1 USD → COP (aproximada)
 */
const TASA_CAMBIO_COP = 4200;

/**
 * Convierte un precio en USD a COP y lo formatea
 * @param {number} precioUSD - Precio en dólares
 * @returns {string} Precio formateado en COP (ej: "$4.200")
 */
const formatoCOP = (precioUSD) => {
  const cop = Math.round(precioUSD * TASA_CAMBIO_COP);
  return "$" + cop.toLocaleString("es-CO");
};

/**
 * Placeholder genérico cuando una imagen no carga
 */
const PLACEHOLDER_IMAGEN = "https://placehold.co/300x300/15803d/fef3c7?text=Stardew";

/**
 * Manejador de error para imágenes: si fallan, muestra el placeholder
 */
const manejarErrorImagen = (e) => {
  if (e.target.src !== PLACEHOLDER_IMAGEN) {
    e.target.src = PLACEHOLDER_IMAGEN;
  }
};

export class ShopPage extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);

    this.state = {
      productos: [],
      cargando: true,
      productosVisibles: PRODUCTOS_POR_PAGINA,
      itemsEnCarrito: 0,
      carritoAbierto: false,
    };
  }

  componentDidMount() {
    this.cargarProductosDesdeAPI();
    this.sincronizarCarrito();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.context && prevState.itemsEnCarrito !== this.context.totalItems) {
      this.sincronizarCarrito();
    }
  }

  sincronizarCarrito = () => {
    if (this.context && this.context.totalItems !== undefined) {
      this.setState({ itemsEnCarrito: this.context.totalItems });
    }
  };

  cargarProductosDesdeAPI = async () => {
    // API pública DummyJSON - categoría "groceries" (víveres, verduras, frutas)
    // Las imágenes vienen sin bloqueo CORS, directamente funcionales
    const URL_API = "https://dummyjson.com/products/category/groceries?limit=30";

    try {
      const respuesta = await axios.get(URL_API);

      // Transformamos los datos de DummyJSON al formato de nuestra tienda
      const productosTransformados = respuesta.data.products.map((p) => ({
        id: p.id,
        nombre: p.title,
        precio: Math.round(p.price),
        categoria: "Víveres",
        stock: p.stock,
        imagen: p.thumbnail || p.images?.[0] || "",
      }));

      this.setState({
        productos: productosTransformados,
        cargando: false,
      });
    } catch (error) {
      console.error("❌ Error al conectar con la API:", error.message);
      this.setState({ productos: [], cargando: false });
    }
  };

  verMasProductos = () => {
    this.setState((prevState) => ({
      productosVisibles: prevState.productosVisibles + PRODUCTOS_POR_PAGINA,
    }));
  };

  manejarAgregarAlCarrito = (producto) => {
    if (this.context && this.context.agregarAlCarrito) {
      this.context.agregarAlCarrito(producto);
    }
  };

  toggleCarrito = () => {
    this.setState((prevState) => ({
      carritoAbierto: !prevState.carritoAbierto,
    }));
  };

  cerrarCarrito = () => {
    this.setState({ carritoAbierto: false });
  };

  renderHeader() {
    const { carritoAbierto } = this.state;
    const itemsCarrito = this.context?.items || [];

    return (
      <header className="bg-[#fef3c7] border-b-4 border-[#854d0e] p-4 sticky top-0 z-30 font-stardewFont shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-[#854d0e]" />
            <h1 className="text-2xl font-bold text-[#854d0e] tracking-wide">
              Mercado del Valle
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>

            <div className="relative">
              <button
                onClick={this.toggleCarrito}
                className="relative flex items-center gap-2 bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] transition-all active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden md:inline">Carrito</span>
                {this.state.itemsEnCarrito > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center border-2 border-white">
                    {this.state.itemsEnCarrito}
                  </span>
                )}
              </button>

              {carritoAbierto && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={this.cerrarCarrito}
                  ></div>

                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] z-50 overflow-hidden">
                    <div className="p-3 bg-[#fef3c7] border-b-2 border-[#854d0e]/30 flex items-center justify-between">
                      <h3 className="font-bold text-[#854d0e] text-sm">
                        🛒 Resumen del carrito
                      </h3>
                      <button
                        onClick={this.cerrarCarrito}
                        className="text-[#854d0e] hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {itemsCarrito.length === 0 ? (
                      <div className="p-6 text-center">
                        <ShoppingCart className="w-10 h-10 text-[#854d0e]/30 mx-auto mb-2" />
                        <p className="text-sm text-[#5c3a21] font-bold">
                          Carrito vacío
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Agrega productos desde el catálogo
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto divide-y divide-[#854d0e]/10">
                          {itemsCarrito.map((item) => (
                            <div
                              key={item.producto.id}
                              className="flex items-center gap-2 p-3 hover:bg-[#fef3c7]/50"
                            >
                              <div className="w-10 h-10 bg-[#15803d] rounded-lg border border-[#854d0e] overflow-hidden flex-shrink-0">
                                <img
                                  src={item.producto.imagen}
                                  alt={item.producto.nombre}
                                  className="w-full h-full object-contain p-0.5"
                                  onError={manejarErrorImagen}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#5c3a21] truncate">
                                  {item.producto.nombre}
                                </p>
                              <p className="text-xs text-[#15803d] font-bold">
                                {formatoCOP(item.producto.precio)} COP
                              </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    this.context.quitarDelCarrito(
                                      item.producto.id
                                    )
                                  }
                                  className="bg-[#fde68a] hover:bg-[#eab308] text-[#854d0e] rounded border border-[#854d0e] w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold text-[#854d0e] w-4 text-center">
                                  {item.cantidad}
                                </span>
                                <button
                                  onClick={() =>
                                    this.context.agregarAlCarrito(
                                      item.producto
                                    )
                                  }
                                  className="bg-[#fde68a] hover:bg-[#eab308] text-[#854d0e] rounded border border-[#854d0e] w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-[#fde68a] border-t-2 border-[#854d0e]/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-[#854d0e]">
                              Total:
                            </span>
                          <span className="text-sm font-black text-[#15803d]">
                              {formatoCOP(this.context.totalPrecio)} COP
                            </span>
                          </div>
                          <Link
                            to="/cart"
                            onClick={this.cerrarCarrito}
                            className="block w-full text-center bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2 rounded-xl border-2 border-[#854d0e] text-xs transition-all"
                          >
                            Ir al carrito
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  render() {
    const { productos, cargando, productosVisibles } = this.state;
    const productosAMostrar = productos.slice(0, productosVisibles);
    const hayMasProductos = productosVisibles < productos.length;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col">
        {this.renderHeader()}

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 font-stardewFont">
          <div className="bg-[#fef3c7] p-6 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
            <h2 className="text-3xl font-bold text-[#854d0e] mb-6 border-b-2 border-[#854d0e] pb-2 tracking-wide">
              Catálogo de Productos
            </h2>

            {cargando ? (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-[#854d0e] animate-pulse">
                  🚜 Cargando los productos de la cosecha...
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {productosAMostrar.map((producto) => (
                    <div
                      key={producto.id}
                      className="bg-white border-4 border-[#854d0e] rounded-2xl p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="w-full h-40 bg-[#15803d] rounded-xl border-2 border-[#854d0e] overflow-hidden flex items-center justify-center mb-3">
                          <img
                            /* 🔥 La API DummyJSON devuelve imágenes sin bloqueo CORS */
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="h-full w-full object-cover"
                            onError={manejarErrorImagen}
                          />
                        </div>

                        <span className="text-xs bg-[#fef3c7] text-[#854d0e] font-bold px-2 py-0.5 rounded-md border border-[#854d0e]">
                          {producto.categoria}
                        </span>
                        <h3 className="text-lg font-bold text-[#5c3a21] mt-2 mb-1">
                          {producto.nombre}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {producto.stock !== undefined
                            ? `Stock disponible: ${producto.stock} uds.`
                            : "Producto de temporada"}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500 font-bold">
                            Precio:
                          </span>
                          <span className="text-md font-black text-[#15803d]">
                            {formatoCOP(producto.precio)} COP
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            this.manejarAgregarAlCarrito(producto)
                          }
                          className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-1.5 rounded-xl border-2 border-[#854d0e] text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          Añadir al carrito
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {hayMasProductos && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={this.verMasProductos}
                      className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg cursor-pointer"
                    >
                      <ChevronDown className="w-5 h-5" />
                      Ver más
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default ShopPage;