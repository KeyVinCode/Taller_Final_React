// src/context/CartContext.jsx
import React, { Component, createContext } from "react";

export const CartContext = createContext();

const STORAGE_KEY = "stardew_carrito";

/**
 * Carga el carrito desde localStorage
 */
const cargarDelStorage = () => {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (datos) {
      return JSON.parse(datos);
    }
  } catch (e) {
    console.warn("Error al cargar carrito del localStorage:", e);
  }
  return { items: [], totalItems: 0, totalPrecio: 0 };
};

/**
 * Guarda el carrito en localStorage
 */
const guardarEnStorage = (items, totalItems, totalPrecio) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, totalItems, totalPrecio })
    );
  } catch (e) {
    console.warn("Error al guardar carrito en localStorage:", e);
  }
};

export class CartProvider extends Component {
  constructor(props) {
    super(props);

    // Cargamos el estado inicial desde localStorage
    const datosGuardados = cargarDelStorage();

    this.state = {
      items: datosGuardados.items || [],
      totalItems: datosGuardados.totalItems || 0,
      totalPrecio: datosGuardados.totalPrecio || 0,
    };
  }

  /**
   * Agrega un producto al carrito.
   * Si ya existe, incrementa la cantidad.
   */
  agregarAlCarrito = (producto) => {
    this.setState(
      (prevState) => {
        const existe = prevState.items.find(
          (item) => item.producto.id === producto.id
        );

        let nuevosItems;
        if (existe) {
          nuevosItems = prevState.items.map((item) =>
            item.producto.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        } else {
          nuevosItems = [...prevState.items, { producto, cantidad: 1 }];
        }

        return this.calcularTotales(nuevosItems);
      },
      () => this.persistirEnStorage()
    );
  };

  /**
   * Quita una unidad del carrito.
   * Si la cantidad llega a 0, elimina el producto del carrito.
   */
  quitarDelCarrito = (idProducto) => {
    this.setState(
      (prevState) => {
        const itemExistente = prevState.items.find(
          (item) => item.producto.id === idProducto
        );

        if (!itemExistente) return null;

        let nuevosItems;
        if (itemExistente.cantidad <= 1) {
          nuevosItems = prevState.items.filter(
            (item) => item.producto.id !== idProducto
          );
        } else {
          nuevosItems = prevState.items.map((item) =>
            item.producto.id === idProducto
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          );
        }

        return this.calcularTotales(nuevosItems);
      },
      () => this.persistirEnStorage()
    );
  };

  /**
   * Elimina completamente un producto del carrito.
   */
  eliminarDelCarrito = (idProducto) => {
    this.setState(
      (prevState) => {
        const nuevosItems = prevState.items.filter(
          (item) => item.producto.id !== idProducto
        );
        return this.calcularTotales(nuevosItems);
      },
      () => this.persistirEnStorage()
    );
  };

  /**
   * Vacía completamente el carrito.
   */
  vaciarCarrito = () => {
    this.setState(
      {
        items: [],
        totalItems: 0,
        totalPrecio: 0,
      },
      () => this.persistirEnStorage()
    );
  };

  /**
   * Calcula los totales del carrito (cantidad de items y precio total).
   */
  calcularTotales = (items) => {
    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrecio = items.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0
    );
    return { items, totalItems, totalPrecio };
  };

  /**
   * Persiste el estado actual del carrito en localStorage
   */
  persistirEnStorage = () => {
    const { items, totalItems, totalPrecio } = this.state;
    guardarEnStorage(items, totalItems, totalPrecio);
  };

  render() {
    const { items, totalItems, totalPrecio } = this.state;

    return (
      <CartContext.Provider
        value={{
          items,
          totalItems,
          totalPrecio,
          agregarAlCarrito: this.agregarAlCarrito,
          quitarDelCarrito: this.quitarDelCarrito,
          eliminarDelCarrito: this.eliminarDelCarrito,
          vaciarCarrito: this.vaciarCarrito,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export default CartProvider;