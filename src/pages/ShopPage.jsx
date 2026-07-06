// src/pages/ShopPage.jsx
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Store,
  ArrowLeft,
  ChevronDown,
  X,
  Package,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const PRODUCTOS_POR_PAGINA = 8;
const TASA_CAMBIO_COP = 4200;

const formatoCOP = (precioUSD) => {
  const cop = Math.round(precioUSD * TASA_CAMBIO_COP);
  return "$" + cop.toLocaleString("es-CO");
};

const PLACEHOLDER_IMAGEN = "https://placehold.co/300x300/15803d/fef3c7?text=Stardew";

const manejarErrorImagen = (e) => {
  if (e.target.src !== PLACEHOLDER_IMAGEN) {
    e.target.src = PLACEHOLDER_IMAGEN;
  }
};

function MenuLink({ to, icon, texto, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2.5 w-full text-left text-[#5c3a21] hover:bg-[#fef3c7] px-3 py-2.5 rounded-xl text-sm font-bold transition-colors">
      {icon}{texto}
    </Link>
  );
}

function MenuButton({ onClick, icon, texto, className = "" }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${className}`}>
      {icon}{texto}
    </button>
  );
}

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
      menuAbierto: false,
    };
  }

  renderNombreUsuario = () => (
    <AuthContext.Consumer>
      {({ usuario }) =>
        usuario ? (
          <div className="hidden sm:flex items-center bg-gradient-to-r from-[#15803d] to-[#166534] px-2.5 lg:px-3 py-1 rounded-xl border-2 border-[#854d0e] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
            <span className="text-xs lg:text-sm font-black text-white tracking-wide drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)]">
              {usuario.display_name}
            </span>
          </div>
        ) : null
      }
    </AuthContext.Consumer>
  );

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
    try {
      const respuesta = await axios.get("https://dummyjson.com/products/category/groceries?limit=30");
      const productosTransformados = respuesta.data.products.map((p) => ({
        id: p.id, nombre: p.title, precio: Math.round(p.price), categoria: "Víveres", stock: p.stock, imagen: p.thumbnail || p.images?.[0] || "",
      }));
      this.setState({ productos: productosTransformados, cargando: false });
    } catch (error) {
      console.error("❌ Error al conectar con la API:", error.message);
      this.setState({ productos: [], cargando: false });
    }
  };

  verMasProductos = () => {
    this.setState((prev) => ({ productosVisibles: prev.productosVisibles + PRODUCTOS_POR_PAGINA }));
  };

  manejarAgregarAlCarrito = (producto) => {
    const usuarioStorage = localStorage.getItem("stardew_usuario");
    if (!usuarioStorage) { this.mostrarToastLogin(); return; }
    try {
      const usuario = JSON.parse(usuarioStorage);
      if (!usuario || !usuario.id) { this.mostrarToastLogin(); return; }
    } catch { this.mostrarToastLogin(); return; }
    if (this.context && this.context.agregarAlCarrito) {
      this.context.agregarAlCarrito(producto);
    }
  };

  mostrarToastLogin = () => {
    toast.warn(<div>⚠️ Debes <Link to="/Login" className="text-[#15803d] font-bold underline">iniciar sesión</Link> para agregar productos al carrito.</div>, { autoClose: 4000 });
  };

  toggleCarrito = () => this.setState((prev) => ({ carritoAbierto: !prev.carritoAbierto }));
  cerrarCarrito = () => this.setState({ carritoAbierto: false });
  toggleMenu = () => this.setState((prev) => ({ menuAbierto: !prev.menuAbierto }));

  renderHeader() {
    const { carritoAbierto, menuAbierto } = this.state;
    const itemsCarrito = this.context?.items || [];

    return (
      <header className="bg-[#fef3c7] border-b-4 border-[#854d0e] px-2 py-2 sticky top-0 z-30 font-stardewFont shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <Store className="w-6 h-6 lg:w-8 lg:h-8 text-[#854d0e]" />
            <h1 className="text-base lg:text-2xl font-bold text-[#854d0e] tracking-wide truncate max-w-[100px] lg:max-w-none">
              Mercado del Valle
            </h1>
          </div>

          <div className="flex items-center gap-1 lg:gap-3">
            {this.renderNombreUsuario()}

            {/* Menú hamburguesa - visible hasta md (767px) */}
            {/* En md (768px-1023px) también se muestra menú pero más compacto */}
            <AuthContext.Consumer>
              {({ usuario, cerrarSesion }) => (
                <div className="lg:hidden relative">
                  <button onClick={this.toggleMenu} className="flex items-center gap-1 bg-[#854d0e] hover:bg-[#5c3a21] text-[#fef3c7] font-bold py-1.5 px-2 rounded-xl border-2 border-[#5c3a21] text-xs transition-all cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {menuAbierto ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                    <span>Menú</span>
                  </button>
                  {menuAbierto && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={this.toggleMenu}></div>
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] z-50 overflow-hidden">
                        <div className="p-2 space-y-1">
                          {usuario ? (
                            <>
                              <MenuLink to="/orders" icon={<Package className="w-4 h-4" />} texto="Mis Pedidos" onClick={this.toggleMenu} />
                              {usuario.user_role === "admin" && (
                                <MenuLink to="/admin" icon={<LayoutDashboard className="w-4 h-4" />} texto="Panel Admin" onClick={this.toggleMenu} />
                              )}
                              <hr className="border-[#854d0e]/20 my-1" />
                              <MenuButton onClick={() => { this.toggleMenu(); cerrarSesion(); }} icon={<ArrowLeft className="w-4 h-4" />} texto="Cerrar Sesión" className="text-red-600 hover:bg-red-50" />
                            </>
                          ) : (
                            <>
                              <MenuLink to="/Login" icon={<LogIn className="w-4 h-4" />} texto="Iniciar Sesión" onClick={this.toggleMenu} />
                              <MenuLink to="/" icon={<ArrowLeft className="w-4 h-4" />} texto="Volver al Inicio" onClick={this.toggleMenu} />
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </AuthContext.Consumer>

            {/* Versión escritorio - visible desde lg (1024px) */}
            <div className="hidden lg:flex items-center gap-1">
              <AuthContext.Consumer>
                {({ usuario }) =>
                  usuario ? (
                    <Link to="/orders" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2 px-3 rounded-xl border-2 border-[#854d0e] text-xs transition-all">
                      <Package className="w-4 h-4" />
                      <span>Pedidos</span>
                    </Link>
                  ) : null
                }
              </AuthContext.Consumer>
              <AuthContext.Consumer>
                {({ usuario }) =>
                  usuario?.user_role === "admin" ? (
                    <Link to="/admin" className="flex items-center gap-2 bg-[#854d0e] hover:bg-[#5c3a21] text-[#fef3c7] font-bold py-2 px-3 rounded-xl border-2 border-[#5c3a21] text-xs transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  ) : null
                }
              </AuthContext.Consumer>
              <AuthContext.Consumer>
                {({ usuario, cerrarSesion }) =>
                  usuario ? (
                    <button onClick={cerrarSesion} className="flex items-center gap-2 bg-white hover:bg-red-50 text-[#854d0e] hover:text-red-600 font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] hover:border-red-400 text-sm transition-all cursor-pointer">
                      <ArrowLeft className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  ) : (
                    <Link to="/Login" className="flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2 px-3 rounded-xl border-2 border-[#854d0e] text-xs transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Iniciar Sesión</span>
                    </Link>
                  )
                }
              </AuthContext.Consumer>
            </div>

            {/* Carrito - siempre visible */}
            <div className="relative">
              <button onClick={this.toggleCarrito} className="relative flex items-center justify-center bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-2 px-2.5 rounded-xl border-2 border-[#854d0e] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] transition-all active:translate-y-0.5 active:shadow-none cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
                {this.state.itemsEnCarrito > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center border-2 border-white">
                    {this.state.itemsEnCarrito}
                  </span>
                )}
              </button>
              {carritoAbierto && (
                <>
                  <div className="fixed inset-0 z-40" onClick={this.cerrarCarrito}></div>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] z-50 overflow-hidden">
                    <div className="p-3 bg-[#fef3c7] border-b-2 border-[#854d0e]/30 flex items-center justify-between">
                      <h3 className="font-bold text-[#854d0e] text-sm">🛒 Resumen del carrito</h3>
                      <button onClick={this.cerrarCarrito} className="text-[#854d0e] hover:text-red-600 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                    </div>
                    {itemsCarrito.length === 0 ? (
                      <div className="p-6 text-center">
                        <ShoppingCart className="w-10 h-10 text-[#854d0e]/30 mx-auto mb-2" />
                        <p className="text-sm text-[#5c3a21] font-bold">Carrito vacío</p>
                        <p className="text-xs text-gray-500 mt-1">Agrega productos desde el catálogo</p>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto divide-y divide-[#854d0e]/10">
                          {itemsCarrito.map((item) => (
                            <div key={item.producto.id} className="flex items-center gap-2 p-3 hover:bg-[#fef3c7]/50">
                              <div className="w-10 h-10 bg-[#15803d] rounded-lg border border-[#854d0e] overflow-hidden flex-shrink-0">
                                <img src={item.producto.imagen} alt={item.producto.nombre} className="w-full h-full object-contain p-0.5" onError={manejarErrorImagen} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#5c3a21] truncate">{item.producto.nombre}</p>
                                <p className="text-xs text-[#15803d] font-bold">{formatoCOP(item.producto.precio)} COP</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => this.context.quitarDelCarrito(item.producto.id)} className="bg-[#fde68a] hover:bg-[#eab308] text-[#854d0e] rounded border border-[#854d0e] w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer">-</button>
                                <span className="text-xs font-bold text-[#854d0e] w-4 text-center">{item.cantidad}</span>
                                <button onClick={() => this.context.agregarAlCarrito(item.producto)} className="bg-[#fde68a] hover:bg-[#eab308] text-[#854d0e] rounded border border-[#854d0e] w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-[#fde68a] border-t-2 border-[#854d0e]/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-[#854d0e]">Total:</span>
                            <span className="text-sm font-black text-[#15803d]">{formatoCOP(this.context.totalPrecio)} COP</span>
                          </div>
                          <Link to="/cart" onClick={this.cerrarCarrito} className="block w-full text-center bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2 rounded-xl border-2 border-[#854d0e] text-xs transition-all">Ir al carrito</Link>
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
          <div className="bg-[#fef3c7] p-4 md:p-6 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl md:text-3xl font-bold text-[#854d0e] mb-4 md:mb-6 border-b-2 border-[#854d0e] pb-2 tracking-wide">Catálogo de Productos</h2>
            {cargando ? (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-[#854d0e] animate-pulse">🚜 Cargando los productos de la cosecha...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {productosAMostrar.map((producto) => (
                    <div key={producto.id} className="bg-white border-4 border-[#854d0e] rounded-2xl p-3 md:p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5">
                      <div>
                        <div className="w-full h-32 md:h-40 bg-[#15803d] rounded-xl border-2 border-[#854d0e] overflow-hidden flex items-center justify-center mb-3">
                          <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" onError={manejarErrorImagen} />
                        </div>
                        <span className="text-xs bg-[#fef3c7] text-[#854d0e] font-bold px-2 py-0.5 rounded-md border border-[#854d0e]">{producto.categoria}</span>
                        <h3 className="text-base md:text-lg font-bold text-[#5c3a21] mt-2 mb-1 truncate">{producto.nombre}</h3>
                        <p className="text-xs text-gray-600 mb-2">{producto.stock !== undefined ? `Stock: ${producto.stock} uds.` : "Producto de temporada"}</p>
                      </div>
                      <div className="mt-4 border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500 font-bold">Precio:</span>
                          <span className="text-sm md:text-md font-black text-[#15803d]">{formatoCOP(producto.precio)} COP</span>
                        </div>
                        <button onClick={() => this.manejarAgregarAlCarrito(producto)} className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-1.5 rounded-xl border-2 border-[#854d0e] text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer">Añadir al carrito</button>
                      </div>
                    </div>
                  ))}
                </div>
                {hayMasProductos && (
                  <div className="flex justify-center mt-8">
                    <button onClick={this.verMasProductos} className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg cursor-pointer">
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