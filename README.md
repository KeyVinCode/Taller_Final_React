# 🌾 Stardew Valley Shop — Tienda Temática

Bienvenido al repositorio de **Stardew Valley Shop**, una tienda en línea temática inspirada en el universo de *Stardew Valley*. Este proyecto fue desarrollado como trabajo final del **Taller de React** del Sena, utilizando **React + Vite** y una paleta de colores rústica que evoca la estética del juego.

---

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
  - [Fase 1: Configuración Inicial](#fase-1-configuración-inicial)
  - [Fase 2: Landing Page](#fase-2-landing-page)
  - [Fase 3: Autenticación](#fase-3-autenticación)
  - [Fase 4: Tienda con Catálogo](#fase-4-tienda-con-catálogo)
  - [Fase 5: Carrito de Compras](#fase-5-carrito-de-compras)
  - [Fase 6: Persistencia con localStorage](#fase-6-persistencia-con-localstorage)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Problemas Conocidos y Soluciones](#problemas-conocidos-y-soluciones)
- [Configuración de Supabase](#configuración-de-supabase)
  - [Variables de Entorno](#variables-de-entorno)
  - [Crear Tabla profiles con Rol](#crear-tabla-profiles-con-rol)
  - [Trigger Automático al Registrarse](#trigger-automático-al-registrarse)
  - [Políticas de Seguridad RLS](#políticas-de-seguridad-rls)
- [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
- [Rutas Disponibles](#rutas-disponibles)

---

## 🛠️ Tecnologías Utilizadas

| Tecnología       | Versión | Propósito                                |
|------------------|---------|------------------------------------------|
| React            | 19.x    | Librería principal de interfaz de usuario |
| Vite             | 8.x     | Bundler y entorno de desarrollo rápido    |
| Tailwind CSS     | 4.x     | Framework de estilos utilitarios          |
| Axios            | 1.x     | Cliente HTTP para consumir la API propia  |
| React Router DOM | 7.x     | Enrutamiento entre páginas                |
| Lucide React     | 1.x     | Íconos SVG ligeros y personalizables      |
| Supabase JS      | 2.x     | Cliente para la base de datos Supabase    |
| React Toastify   | 11.x    | Alertas y notificaciones toast            |

---

## 📁 Estructura del Proyecto

```
Taller_Final/
├── public/
│   ├── favicon.svg          # Icono de la pestaña
│   └── icons.svg            # Iconos SVG adicionales
├── src/
│   ├── Api/
│   │   └── apiClient.js      # Configuración del cliente Axios
│   ├── assets/               # Recursos estáticos (imágenes, fuentes)
│   ├── components/
│   │   ├── Landing/          # Componente de la Landing Page
│   │   ├── auth/             # Componentes de Login y Registro
│   │   ├── admin/            # Componentes del panel de administración
│   │   ├── client/           # Componentes del perfil del cliente
│   │   └── common/           # Componentes compartidos (Navbar, Footer)
│   ├── context/
│   │   ├── AuthContext.jsx    # Contexto de autenticación
│   │   ├── CartContext.jsx    # Contexto del carrito de compras
│   │   └── OrderContext.jsx   # Contexto de pedidos
│   ├── hooks/
│   │   └── useAuth.js        # Hook personalizado de autenticación
│   ├── pages/
│   │   ├── LandingPage.jsx   # Página de inicio (bienvenida)
│   │   ├── ShopPage.jsx      # Tienda con catálogo de productos
│   │   ├── CartPage.jsx      # Carrito de compras completo
│   │   ├── AdminPage.jsx     # Panel de administración
│   │   ├── HomePage.jsx      # Página principal post-login
│   │   ├── OrdersPage.jsx    # Historial de pedidos
│   │   └── NotFoundPage.jsx  # Página 404
│   ├── styles/
│   │   ├── index.css         # Estilos globales + tema Tailwind
│   │   └── App.css           # Estilos adicionales de la app
│   ├── utils/
│   │   ├── helpers.js        # Funciones auxiliares
│   │   ├── Rutas.jsx         # Definición de todas las rutas
│   │   └── supabaseClient.js # Configuración de Supabase
│   ├── App.jsx               # Componente raíz
│   └── main.jsx              # Punto de entrada con providers
├── .env                      # Variables de entorno (Supabase URL + Key)
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── pnpm-lock.yaml
└── README.md
```

---

## 🚧 Proceso de Desarrollo

### Fase 1: Configuración Inicial

Se creó el proyecto con **Vite + React** y se configuró:
- **Tailwind CSS v4** con tema personalizado (colores Stardew Valley, fuente `Courier New`)
- **pnpm** como gestor de paquetes (workspace)
- **React Router DOM** para navegación entre páginas
- **Axios** para consumo de APIs externas

**Tema personalizado en `tailwind.config.js`:**
- `stardew-wood` (#854d0e) — marrón madera
- `stardew-cream` (#fef3c7) — crema
- `stardew-green` (#15803d) — verde hierba
- `stardew-gold` (#eab308) — dorado

### Fase 2: Landing Page

Se creó una página de bienvenida temática con:
- Hero section con degradado de cielo azul (estilo Stardew Valley)
- Cartel principal estilo "cuadro de diálogo" del juego
- Botones con efecto de presión 3D
- Sección de características con tarjetas animadas
- Footer informativo

### Fase 3: Autenticación

Se implementaron las páginas de **Login** y **Registro** con:
- Formularios con diseño temático
- Conexión a Supabase para autenticación
- Contexto de autenticación global
- **Roles de usuario:** Se creó la tabla pública `profiles` con campo `user_role` que por defecto es `"cliente"`. El registro asigna el rol automáticamente. Los administradores pueden cambiar el rol desde la base de datos a `"admin"`.

**Flujo de registro:**
1. El usuario llena el formulario (nombre, correo, contraseña)
2. Se envía a `supabase.auth.signUp()` con metadatos: `display_name` y `user_role`
3. Un **trigger automático** en Supabase inserta el perfil en la tabla `profiles`
4. Adicionalmente, el código hace un INSERT manual como respaldo
5. Se muestra una alerta indicando si debe confirmar el correo o ya puede iniciar sesión

### Fase 4: Tienda con Catálogo

**ShopPage** consume una API propia alojada en GitHub Gist que contiene 30 productos del universo Stardew Valley (semillas, productos artesanales, conservas, etc.).

**Paginación "Ver más":**
- Se muestran 8 productos inicialmente
- Botón "Ver más" que carga 8 productos adicionales por clic
- Hasta mostrar los 30 productos disponibles

**Imágenes de los productos:**
Las imágenes se generan dinámicamente con el nombre del producto usando el servicio `placehold.co`, con colores temáticos (fondo verde, texto crema).

### Fase 5: Carrito de Compras

Se implementó un sistema de carrito completo usando **React Context API**:

**CartContext** provee:
- `agregarAlCarrito(producto)` — Añade o incrementa cantidad
- `quitarDelCarrito(id)` — Reduce cantidad o elimina si llega a 0
- `eliminarDelCarrito(id)` — Elimina completamente un producto
- `vaciarCarrito()` — Limpia todo el carrito

**Componentes del carrito:**
- **Dropdown en el header de ShopPage:** Muestra resumen rápido con lista de productos, controles +/- y total
- **CartPage (`/cart`):** Página completa con lista detallada, subtotales, total, envío gratis y botón "Pagar ahora"

### Fase 6: Persistencia con localStorage

El carrito se guarda automáticamente en `localStorage` bajo la clave `stardew_carrito`. Esto permite:
- Mantener los productos seleccionados al recargar la página
- Recuperar el carrito al cerrar y volver a abrir el navegador
- Funcionar sin necesidad de backend ni base de datos

---

## ✨ Funcionalidades Implementadas

- [x] **Landing Page** con diseño temático de Stardew Valley
- [x] **Autenticación** (Login/Registro) con Supabase y roles de usuario
- [x] **Tabla pública `profiles`** con rol `cliente` / `admin`
- [x] **Trigger automático** que crea el perfil al registrarse
- [x] **Catálogo de productos** consumido desde API externa (30 productos)
- [x] **Paginación "Ver más"** — carga progresiva de productos
- [x] **Imágenes generadas dinámicamente** con el nombre del producto
- [x] **Carrito de compras global** con React Context
- [x] **Dropdown de resumen** del carrito en el header
- [x] **Página de carrito completa** con controles de cantidad y totales
- [x] **Persistencia en localStorage** (el carrito sobrevive a recargas)
- [x] **Alertas visuales** con React Toastify
- [x] **Diseño responsive** (grid adaptable a móvil, tablet y escritorio)
- [x] **Estilo temático** consistente con sombras 3D, bordes y paleta de colores

---

## 🐛 Problemas Conocidos y Soluciones

### 1. ❌ Imágenes bloqueadas por CORS (stardewvalleywiki.com)

**Problema:** Las URLs de las imágenes en la API apuntaban a `stardewvalleywiki.com`, pero este dominio bloquea el **hotlinking** mediante CORS. El navegador impedía que las imágenes se mostraran desde otro dominio, mostrando el placeholder genérico.

**Intento de solución 1 — Proxy CORS:**
Se implementó un proxy usando `images.weserv.nl` que descarga la imagen y la sirve con los encabezados CORS correctos. Sin embargo, este proxy no siempre funcionaba de manera confiable.

**Solución final — Placeholders personalizados:**
Se implementó la función `generarImagenProducto()` en `ShopPage.jsx` que genera una URL de `placehold.co` con:
- El nombre del producto como texto
- Colores temáticos: fondo `#15803d` (verde) y texto `#fef3c7` (crema)
- Tamaño 300x300px con `object-contain`

Esto elimina por completo la dependencia de servidores externos bloqueados y garantiza que siempre se muestre una imagen legible.

### 2. ❌ Campo "stock" faltante en la API

**Problema:** El JSON de la API no incluye el campo `stock` para los productos, por lo que se mostraba "Stock disponible: undefined uds." en cada tarjeta.

**Solución:** Se agregó un condicional en la card del producto:
```jsx
{producto.stock !== undefined
  ? `Stock disponible: ${producto.stock} uds.`
  : "Producto de temporada"}
```

### 3. ❌ El botón del carrito era un enlace (Link), no un botón funcional

**Problema:** El botón "Carrito" en el header redirigía a `/cart` en lugar de mostrar un resumen desplegable de los productos seleccionados.

**Solución:** Se cambió de `<Link>` a `<button>` y se implementó un **dropdown** con:
- Lista de productos con imagen miniatura, nombre, precio
- Controles **+/-** para ajustar cantidades
- Total acumulado
- Botón "Ir al carrito" para navegar a la página completa
- Overlay para cerrar al hacer clic fuera

### 4. ❌ Alertas de react-toastify no se mostraban (ToastContainer faltante)

**Problema:** Las alertas (`toast.warn`, `toast.success`, `toast.error`) no aparecían en pantalla al registrarse o al iniciar sesión.

**Causa:** El componente `<ToastContainer />` de `react-toastify` **nunca se estaba renderizando** en el árbol de la aplicación. Sin él, las alertas no tienen dónde mostrarse y se pierden silenciosamente.

**Solución:** Se agregó `<ToastContainer>` en `src/App.jsx` con configuración completa:
```jsx
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <ToastContainer position="top-right" theme="colored" autoClose={3000} />
      <Rutas/>
    </>
  )
}
```

### 5. ❌ Registro mostraba "éxito" pero el usuario no aparecía en la BD

**Problema:** Al registrarse, Supabase creaba el usuario en su tabla interna `auth.users` (invisible desde el editor de tablas), pero nunca se guardaba en una tabla pública visible. Además, el mensaje de éxito no aclaraba si debía confirmar el correo o no.

**Causa:** Supabase guarda los usuarios autenticados en `auth.users` (tabla del sistema). Para tener datos visibles como `display_name` y `user_role`, se necesita una tabla pública con un trigger.

**Solución:**
1. Se creó la tabla pública `profiles` con los campos: `id`, `display_name`, `email`, `user_role`, `created_at`
2. Se implementó un **trigger automático** en Supabase que inserta el perfil cuando se crea un usuario
3. El código también hace un **INSERT manual** como respaldo por si el trigger falla
4. Se agregaron mensajes claros que distinguen entre:
   - Registro con confirmación de email pendiente
   - Registro exitoso sin confirmación
   - Correo ya registrado
   - Contraseña débil
   - Límite de intentos excedido

---

## ⚙️ Configuración de Supabase

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-pública
```

Estos valores se obtienen de: **Supabase Dashboard → Settings → API**

### Crear Tabla profiles con Rol

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Crear la tabla pública de perfiles de usuario con su rol
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  user_role TEXT DEFAULT 'cliente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Trigger Automático al Registrarse

Crea un trigger que inserte automáticamente el perfil cuando alguien se registre:

```sql
-- Función que se ejecutará al crear un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, user_role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vincular el trigger al evento de creación de usuario
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Políticas de Seguridad RLS

Para que los usuarios puedan leer y escribir su propio perfil:

```sql
-- Activar RLS en la tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: los usuarios pueden ver solo su propio perfil
CREATE POLICY "Usuarios ven su propio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: permitir inserción de perfil al registrarse
CREATE POLICY "Permitir inserción de perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política: los usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios actualizan su perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

> **Nota:** El rol por defecto es `"cliente"`. Para cambiar a `"admin"`, debes actualizar manualmente el registro en la tabla `profiles` desde el panel de Supabase.

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos

- Node.js 18+
- pnpm (recomendado) o npm

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/KeyVinCode/Taller_Final_React.git

# 2. Entrar al directorio
cd Taller_Final_React

# 3. Instalar dependencias
pnpm install

# 4. Configurar variables de entorno
#    Crea un archivo .env con tus credenciales de Supabase

# 5. Iniciar servidor de desarrollo
pnpm run dev
```

### Comandos disponibles

| Comando            | Descripción                              |
|--------------------|------------------------------------------|
| `pnpm run dev`     | Inicia el servidor de desarrollo (Vite)  |
| `pnpm run build`   | Compila para producción                  |
| `pnpm run preview` | Previsualiza la build de producción      |
| `pnpm run lint`    | Ejecuta el linter (Oxlint)               |

---

## 🧭 Rutas Disponibles

| Ruta           | Componente      | Descripción                               |
|----------------|-----------------|-------------------------------------------|
| `/`            | LandingPage     | Página de bienvenida temática             |
| `/Login`       | Login           | Inicio de sesión                          |
| `/Registro`    | Register        | Registro de nuevo usuario                 |
| `/Shop`        | ShopPage        | Tienda con catálogo y paginación          |
| `/cart`        | CartPage        | Carrito de compras completo               |
| `/admin`       | AdminPage       | Panel de administración                   |
| `/orders`      | OrdersPage      | Historial de pedidos                      |
| `*`            | NotFoundPage    | Página 404 personalizada                  |

---

## 📦 API de Productos

El catálogo de productos se obtiene desde un archivo JSON alojado en GitHub Gist:

```
https://gist.githubusercontent.com/KeyVinCode/58157ab9d21609f9b85f0bd327109da9/raw/.../productos.json
```

**Estructura del JSON:**
```json
[
  {
    "id": 1,
    "nombre": "Semillas de Parsnip",
    "precio": 20,
    "categoria": "Semillas",
    "imagen": "https://stardewvalleywiki.com/mediawiki/images/...png"
  }
]
```

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos como parte del **Taller de React** del Sena. Todos los derechos de *Stardew Valley* pertenecen a **ConcernedApe**.