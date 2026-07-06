# 🌾 Stardew Valley Shop — Tienda Temática

Bienvenido al repositorio de **Stardew Valley Shop**, una tienda en línea temática inspirada en el universo de *Stardew Valley*. Este proyecto fue desarrollado como trabajo final del **Taller de React** del Sena, utilizando **React + Vite** y una paleta de colores rústica que evoca la estética del juego.

---

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
  - [Fase 1: Configuración Inicial](#fase-1-configuración-inicial)
  - [Fase 2: Landing Page](#fase-2-landing-page)
  - [Fase 3: Autenticación y Roles](#fase-3-autenticación-y-roles)
  - [Fase 4: Tienda con Catálogo (API DummyJSON)](#fase-4-tienda-con-catálogo-api-dummyjson)
  - [Fase 5: Carrito de Compras](#fase-5-carrito-de-compras)
  - [Fase 6: Persistencia con localStorage](#fase-6-persistencia-con-localstorage)
  - [Fase 7: Precios en Pesos Colombianos COP](#fase-7-precios-en-pesos-colombianos-cop)
  - [Fase 8: Nombre de Usuario en la Tienda](#fase-8-nombre-de-usuario-en-la-tienda)
  - [Fase 9: Historial y Detalle de Pedidos](#fase-9-historial-y-detalle-de-pedidos)
  - [Fase 10: Panel de Administración](#fase-10-panel-de-administración)
  - [Fase 11: Navegación y Protección de Rutas Admin](#fase-11-navegación-y-protección-de-rutas-admin)
  - [Fase 12: Listado de Clientes para Admin](#fase-12-listado-de-clientes-para-admin)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Problemas Conocidos y Soluciones](#problemas-conocidos-y-soluciones)
- [Configuración de Supabase](#configuración-de-supabase)
  - [Variables de Entorno](#variables-de-entorno)
  - [Crear Tabla profiles con Rol](#crear-tabla-profiles-con-rol)
  - [Crear Tabla orders (Pedidos)](#crear-tabla-orders-pedidos)
  - [Trigger Automático al Registrarse](#trigger-automático-al-registrarse)
  - [Políticas de Seguridad RLS (Admin)](#políticas-de-seguridad-rls-admin)
- [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
- [Rutas Disponibles](#rutas-disponibles)

---

## 🛠️ Tecnologías Utilizadas

| Tecnología       | Versión | Propósito                                |
|------------------|---------|------------------------------------------|
| React            | 19.x    | Librería principal de interfaz de usuario |
| Vite             | 8.x     | Bundler y entorno de desarrollo rápido    |
| Tailwind CSS     | 4.x     | Framework de estilos utilitarios          |
| Axios            | 1.x     | Cliente HTTP para consumir APIs externas  |
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
│   ├── icons.svg            # Iconos SVG adicionales
│   └── images/              # Imágenes locales (SVG generados)
├── src/
│   ├── Api/
│   │   └── apiClient.js      # Configuración del cliente Axios
│   ├── assets/               # Recursos estáticos (imágenes, fuentes)
│   ├── components/
│   │   ├── Landing/          # LandingPage.jsx (bienvenida)
│   │   ├── auth/             # Login.jsx y Register.jsx
│   │   ├── admin/            # AdminNavbar, AdminGuard, ClientList
│   │   ├── client/           # Cart, OrdersHistory, OrderDetail
│   │   └── common/           # Navbar, Footer
│   ├── context/
│   │   ├── AuthContext.jsx    # Contexto de autenticación + roles
│   │   ├── CartContext.jsx    # Contexto del carrito de compras
│   │   └── OrderContext.jsx   # Contexto de pedidos
│   ├── hooks/
│   │   └── useAuth.js        # Hook personalizado de autenticación
│   ├── pages/
│   │   ├── LandingPage.jsx   # Página de inicio (bienvenida)
│   │   ├── ShopPage.jsx      # Tienda con catálogo de productos
│   │   ├── CartPage.jsx      # Carrito de compras completo
│   │   ├── AdminPage.jsx     # Dashboard de administración
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
│   ├── App.jsx               # Componente raíz con ToastContainer
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
- **Botón "Ver Catálogo"** conectado a `/Shop` (antes era un botón sin funcionalidad)
- **Redirección inteligente:** Si el usuario es admin, el botón "Ingresar" lleva a `/admin`

### Fase 3: Autenticación y Roles

Se implementaron las páginas de **Login** y **Registro** con:
- Formularios con diseño temático
- Conexión a Supabase para autenticación
- **AuthContext** global que guarda el usuario en localStorage
- **Roles de usuario:** `profiles.user_role` = `"cliente"` (por defecto) o `"admin"`
- El login redirige según el rol: admin → `/admin`, cliente → `/shop`
- **Nombre de usuario visible** en el header de la tienda
- **Bloqueo de compras:** Si no hay sesión activa, el botón "Añadir al carrito" muestra una alerta con link a iniciar sesión

**Flujo de registro:**
1. El usuario llena el formulario (nombre, correo, contraseña)
2. Se envía a `supabase.auth.signUp()` con metadatos: `display_name` y `user_role`
3. Un **trigger automático** en Supabase inserta el perfil en la tabla `profiles`
4. Adicionalmente, el código hace un INSERT manual como respaldo
5. Se muestra una alerta indicando si debe confirmar el correo o ya puede iniciar sesión

### Fase 4: Tienda con Catálogo (API DummyJSON)

**ShopPage** consume la API pública **DummyJSON** en la categoría "groceries" (víveres, verduras, frutas):

```
https://dummyjson.com/products/category/groceries?limit=30
```

**Ventajas sobre la API anterior (GitHub Gist):**
- ✅ **Imágenes sin bloqueo CORS** (funcionan directamente)
- ✅ **Campo `stock`** incluido en la respuesta
- ✅ **Precios reales** en USD que se convierten a COP

**Paginación "Ver más":**
- Se muestran 8 productos inicialmente
- Botón "Ver más" que carga 8 productos adicionales por clic
- Sin contadores de "restantes"

**Imágenes de los productos:**
Las imágenes vienen directamente del CDN de DummyJSON, sin necesidad de proxys ni placeholders. Si alguna imagen falla, se muestra un placeholder de respaldo con colores temáticos.

### Fase 5: Carrito de Compras

Se implementó un sistema de carrito completo usando **React Context API**:

**CartContext** provee:
- `agregarAlCarrito(producto)` — Añade o incrementa cantidad
- `quitarDelCarrito(id)` — Reduce cantidad o elimina si llega a 0
- `eliminarDelCarrito(id)` — Elimina completamente un producto
- `vaciarCarrito()` — Limpia todo el carrito

**Componentes del carrito:**
- **Dropdown en el header de ShopPage:** Muestra resumen rápido con lista de productos, controles +/- y total. Solo visible si hay sesión activa.
- **CartPage (`/cart`):** Página completa con lista detallada, subtotales, total, envío gratis y botón "Realizar pedido" que guarda en Supabase

### Fase 6: Persistencia con localStorage

El carrito se guarda automáticamente en `localStorage` bajo la clave `stardew_carrito`. Esto permite:
- Mantener los productos seleccionados al recargar la página
- Recuperar el carrito al cerrar y volver a abrir el navegador
- Funcionar sin necesidad de backend ni base de datos

### Fase 7: Precios en Pesos Colombianos COP

Los precios que vienen en USD desde la API DummyJSON se convierten automáticamente a **pesos colombianos (COP)**:

```jsx
const TASA_CAMBIO_COP = 4200; // 1 USD ≈ $4,200 COP

const formatoCOP = (precioUSD) => {
  const cop = Math.round(precioUSD * TASA_CAMBIO_COP);
  return "$" + cop.toLocaleString("es-CO"); // "$8.358" formateado en español
};
```

| Producto (API) | Precio USD | Precio COP | Se muestra como |
|---------------|-----------|-----------|-----------------|
| 🍎 Apple | $1.99 | $8,358 | **$8,358 COP** |
| 🥩 Beef Steak | $12.99 | $54,558 | **$54,558 COP** |
| 🐔 Chicken Meat | $9.99 | $41,958 | **$41,958 COP** |

### Fase 8: Nombre de Usuario en la Tienda

**AuthContext** guarda el usuario completo al iniciar sesión:
- `id`, `email`, `display_name`, `user_role`
- Persiste en `localStorage` (clave `stardew_usuario`)
- Se carga automáticamente al montar la app

En el header de `ShopPage` se muestra:
- 👨‍🌾 **Nombre del usuario** (etiqueta verde)
- Botón **✕** para cerrar sesión
- Enlace a **Pedidos** (`/orders`)
- Enlace a **Carrito** con contador

### Fase 9: Historial y Detalle de Pedidos

**OrdersHistory (`/orders`):**
- Lista todos los pedidos del usuario logueado
- Cada pedido muestra: ID, fecha, estado, miniatura de productos, total en COP
- 5 estados visuales con íconos: ⏳ Pendiente, ✅ Aprobado, ❌ Rechazado, 🚚 Enviado, 🏠 Entregado
- Cada pedido es un enlace al detalle (`/orders/:id`)

**OrderDetail (`/orders/:id`):**
- Muestra todos los productos del pedido con: imagen, nombre, cantidad, precio unitario, subtotal
- Totales y envío gratis
- Fecha formateada en español colombiano

### Fase 10: Panel de Administración

**AdminPage (`/admin`)** — Dashboard con:
- **4 tarjetas de resumen:** Clientes totales, Pedidos totales, Productos en catálogo, Ingresos en COP
- **Estados de pedidos:** 5 indicadores visuales (Pendiente, Aprobado, Rechazado, Enviado, Entregado)
- **Tabla de últimos 5 pedidos** de todos los usuarios (ID, Fecha, Cliente, Total, Estado)
- Botón "Reintentar" en caso de error

### Fase 11: Navegación y Protección de Rutas Admin

**AdminNavbar:** Barra de navegación superior exclusiva para admins:
- Color marrón oscuro con enlaces crema
- Enlaces: Dashboard, Pedidos, Productos, Clientes, Tienda
- Menú responsive (escritorio horizontal, móvil desplegable)
- Botón de cerrar sesión
- Se oculta automáticamente si el usuario no es admin

**AdminGuard:** Componente de protección de rutas:
- Si el usuario **no está logueado** o **no es admin** → muestra "Acceso Denegado"
- Si el usuario **es admin** → renderiza el contenido normalmente

### Fase 12: Listado de Clientes para Admin

**ClientList (`/admin/clientes`):**
- Listado completo de todos los usuarios registrados
- Columnas: Usuario (con avatar inicial), Correo, Rol, Fecha de registro, ID
- **Buscador en vivo** que filtra por nombre, correo o rol
- Roles con etiquetas de color: Verde = Cliente, Dorado = Admin
- Diseño responsive (columnas de fecha e ID se ocultan en móvil)
- Protegido por AdminGuard

### Fase 13: Listado de Pedidos para Admin con Modal de Estados

**OrderList (`/admin/pedidos`):**
- **Tabla de pedidos** con columnas: ID, Fecha, Cliente, Productos (miniaturas), Total en COP, Estado y Editar
- **Ordenados por fecha descendente** (más recientes primero)
- **Nombre del cliente** mostrado desde la tabla `profiles` con restauración de sesión Supabase
- **Botón "Actualizar"** para refrescar la lista sin recargar la página

**Modal de edición de estados:**
- Icono **Editar (Edit3)** en cada fila que abre un modal con los 5 estados del dashboard
- Al hacer clic en un estado disponible, se abre un **modal de confirmación personalizado** (sin `window.confirm()` del navegador) con diseño temático (icono de advertencia, estado destino destacado, botones Cancelar/Confirmar)
- **Bloqueo de scroll** del fondo mientras el modal está abierto (`document.body.style.overflow`)

**Validaciones de estado:**
- ❌ **Rechazado:** No se puede cambiar a ningún otro estado (botones deshabilitados con tooltip)
- ✅ **Aprobado:** No se puede volver a "Pendiente" (solo puede avanzar a Enviado/Entregado)
- 🔄 **Estado actual:** Deshabilitado y marcado con etiqueta "Actual"

### Fase 14: Mejoras en la Experiencia de Usuario (UX)

**Header del catálogo (`ShopPage`):**
- **Usuario logueado:** Muestra nombre en badge verde degradado (sin emoji), botones de Pedidos, Admin (si aplica), Cerrar Sesión y Carrito
- **Sin sesión:** Muestra botón "Iniciar Sesión" (verde), "Volver" y Carrito
- **Botón "Pedidos":** Visible solo cuando hay sesión activa
- **Botón "Volver"** se transforma en **"Cerrar Sesión"** con hover rojo cuando el usuario está logueado

**Navbar de administración (`AdminNavbar`):**
- Nombre de usuario con icono **User** en lugar de emoji 👨‍🌾
- Botón **"Salir"** con icono LogOut al mismo nivel que los demás botones
- Texto más grande (`text-sm font-bold`)

**Dashboard (`AdminPage`):**
- Columna "Cliente" ahora muestra el **nombre real** del usuario en lugar del ID

### Fase 15: Corrección de Sesión y Persistencia

**AuthContext:**
- Se agregó `componentDidMount()` con `verificarSesion()` para restaurar la sesión al cargar la app
- Listener `onAuthStateChange` para sincronización en tiempo real (SIGNED_OUT, SIGNED_IN, TOKEN_REFRESHED)
- Estado `cargando` evita consultas prematuras antes de restaurar la sesión
- Helper `restaurarSesion()` en `src/utils/sessionHelper.js` que busca la sesión en localStorage con 3 niveles de fallback

**ClientList y OrderList:**
- Refresco de sesión (`supabase.auth.getSession()` + `setSession()`) antes de consultar `profiles` para que las políticas RLS reconozcan al admin autenticado
- Fallback desde `localStorage` para mostrar al menos el nombre del usuario actual si la consulta RLS falla

### Fase 16: Detalle de Pedido para Administradores

**AdminOrderDetail (`/admin/pedidos/:id`):**
- Muestra la **información completa del cliente**: nombre, avatar, correo, fecha de registro
- Lista **todos los productos** del pedido con: imagen, nombre, cantidad, precio unitario y subtotal
- Totales: subtotal, envío gratis y total general en COP
- Estado del pedido con icono y color
- Botón "Volver a Pedidos" para regresar al listado

### Fase 17: Página de Diagnóstico

**DiagnosticoPage (`/diagnostico`):**
- Herramienta de diagnóstico en vivo que verifica:
  - ✅ Token de Supabase en localStorage
  - ✅ Restauración de sesión
  - ✅ Autenticación del usuario
  - 📋 Conteo de registros en `profiles` y `orders`
  - ❌ Errores RLS (código 42501)
- Interfaz tipo terminal con colores (verde/rojo/amarillo)
- Sin autenticación requerida para facilitar el debugging

### Fase 18: Protección de Rutas Admin Mejorada

**AdminGuard:** Ahora fuerza la restauración de sesión de Supabase en `componentDidMount()` antes de renderizar los componentes hijos, evitando que las políticas RLS bloqueen consultas por falta de sesión activa.

---

## ✨ Funcionalidades Implementadas

- [x] **Landing Page** con diseño temático de Stardew Valley
- [x] **Autenticación** (Login/Registro) con Supabase y roles de usuario
- [x] **AuthContext** con persistencia en localStorage y restauración de sesión
- [x] **Nombre de usuario visible** en el header de la tienda y navbar admin
- [x] **Redirección por rol** (admin → `/admin`, cliente → `/shop`)
- [x] **Bloqueo de compras** sin sesión activa
- [x] **Catálogo de productos** desde API DummyJSON (30 productos, sin CORS)
- [x] **Paginación "Ver más"** — carga progresiva de 8 en 8
- [x] **Precios convertidos a COP** (pesos colombianos)
- [x] **Carrito de compras global** con React Context
- [x] **Dropdown de resumen** del carrito en el header
- [x] **Página de carrito completa** con controles de cantidad y totales
- [x] **Realizar pedido** — guarda en Supabase y vacía el carrito
- [x] **Persistencia en localStorage** (el carrito sobrevive a recargas)
- [x] **Historial de pedidos** con fecha, total y estado
- [x] **Detalle del pedido** con productos, cantidades y subtotales
- [x] **5 estados de pedido** (Pendiente, Aprobado, Rechazado, Enviado, Entregado)
- [x] **Dashboard de administración** con resumen de datos y nombres de clientes
- [x] **Navbar exclusivo para admin** con icono User y botón Salir
- [x] **Protección de rutas Admin** (AdminGuard) con navbar automático
- [x] **Listado de clientes** con buscador en vivo (solo admin)
- [x] **Listado de pedidos** con tabla completa, edición por modal y confirmación
- [x] **Modal de confirmación personalizado** (sin alertas del navegador)
- [x] **Validaciones de estado** (rechazado bloqueado, aprobado no vuelve a pendiente)
- [x] **Bloqueo de scroll** en modales
- [x] **Botón "Admin"** en la tienda para acceso rápido al panel
- [x] **Iniciar sesión desde el catálogo** sin necesidad de volver al landing
- [x] **Header adaptable** según sesión (logueado vs visitante)
- [x] **Restauración de sesión Supabase** al recargar la página
- [x] **Alertas visuales** con React Toastify
- [x] **Diseño responsive** (grid adaptable a móvil, tablet y escritorio)
- [x] **Estilo temático** consistente con sombras 3D, bordes y paleta de colores

---

## 🐛 Problemas Conocidos y Soluciones

### 1. ❌ Imágenes bloqueadas por CORS (stardewvalleywiki.com)

**Problema:** Las URLs de las imágenes en la API original apuntaban a `stardewvalleywiki.com`, pero este dominio bloquea el **hotlinking** mediante CORS.

**Solución final — Cambio a DummyJSON:**
Se reemplazó la API propia por **DummyJSON** (`https://dummyjson.com/products/category/groceries`), cuyas imágenes vienen de `cdn.dummyjson.com` **sin bloqueo CORS**. También se agregó un placeholder de respaldo si alguna imagen falla.

### 2. ❌ Campo "stock" faltante en la API original

**Problema:** El JSON original no incluía el campo `stock`.

**Solución:** La nueva API DummyJSON incluye `stock` en cada producto. Además, se mantiene el condicional:
```jsx
{producto.stock !== undefined
  ? `Stock disponible: ${producto.stock} uds.`
  : "Producto de temporada"}
```

### 3. ❌ El botón del carrito era un enlace (Link)

**Problema:** Redirigía a `/cart` en lugar de mostrar un resumen.

**Solución:** Se cambió de `<Link>` a `<button>` y se implementó un **dropdown** con controles +/- y total.

### 4. ❌ Alertas de react-toastify no se mostraban

**Causa:** El `<ToastContainer />` no estaba renderizado en la app.

**Solución:** Se agregó en `src/App.jsx`:
```jsx
<ToastContainer position="top-right" theme="colored" autoClose={3000} />
```

### 5. ❌ Registro mostraba "éxito" pero el usuario no aparecía en la BD

**Causa:** Supabase guarda usuarios en `auth.users` (tabla del sistema), no en una tabla pública.

**Solución:** Se creó la tabla `profiles` con trigger automático e INSERT manual de respaldo.

### 6. ❌ Admin no veía datos en Dashboard ni en Clientes

**Causa 1 — Políticas RLS faltantes:** Las políticas RLS de Supabase bloqueaban las consultas SELECT a `profiles` y `orders` para el admin.

**Solución 1:** Se crearon políticas RLS que permiten a los admins leer todos los registros:
```sql
CREATE POLICY "Admins ven todos los perfiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated' AND (
    auth.uid() = id OR
    (SELECT user_role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  ));
```

**Causa 2 — JWT desactualizado (user_metadata):** Aunque se crearon las políticas correctas, si las políticas usan `auth.jwt() -> 'user_metadata' ->> 'user_role'` en lugar de consultar la tabla `profiles`, el problema persiste. Esto ocurre cuando el rol se asigna manualmente en `profiles` pero el token JWT del usuario (generado al iniciar sesión) no se actualiza.

**Síntoma:** El Dashboard muestra 0 clientes o 0 pedidos, y en la consola del navegador no aparece error 403/401, solo datos vacíos.

**Diagnóstico:** Para verificar qué políticas tienes activas:
```sql
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'orders');
```
Si el `qual` contiene `auth.jwt() -> 'user_metadata'`, está usando el JWT, no la tabla.

**Solución 2 — Actualizar user_metadata del admin en auth.users:**
```sql
UPDATE auth.users 
SET raw_user_meta_data = 
  raw_user_meta_data || '{"user_role": "admin"}'::jsonb
WHERE email = 'tu-email@admin.com';
```
Después de ejecutar, el usuario debe **cerrar sesión y volver a iniciarla** para que el JWT se regenere con el rol correcto.

**Solución 3 (recomendada) — Cambiar las políticas para que consulten profiles en lugar del JWT:**
```sql
DROP POLICY IF EXISTS "Leer perfiles" ON public.profiles;
CREATE POLICY "Leer perfiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR
    (SELECT user_role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Leer pedidos" ON public.orders;
CREATE POLICY "Leer pedidos"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = usuario_id OR
    (SELECT user_role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
```
Esta es la solución más robusta porque cualquier cambio futuro en `profiles.user_role` se reflejará inmediatamente, sin necesidad de cerrar sesión.

### 7. ❌ El botón "Ver Catálogo" no funcionaba

**Problema:** Era un `<button>` sin funcionalidad.

**Solución:** Se cambió por un `<Link to="/Shop">` que redirige al catálogo de productos.

### 8. ❌ Usuarios no logueados podían agregar productos al carrito

**Problema:** No había verificación de sesión antes de añadir al carrito.

**Solución:** Se agregó verificación en `manejarAgregarAlCarrito()` que lee de `localStorage` y muestra una alerta con link a iniciar sesión si no hay usuario.

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

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  user_role TEXT DEFAULT 'cliente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Crear Tabla orders (Pedidos)

```sql
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id),
  productos JSONB NOT NULL,
  total_productos INTEGER NOT NULL,
  total_precio NUMERIC NOT NULL,
  total_precio_cop NUMERIC NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Trigger Automático al Registrarse

```sql
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Políticas de Seguridad RLS (Admin)

```sql
-- ============================================
-- 1. Políticas para profiles
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Los admins ven todos los perfiles, los clientes solo el suyo
DROP POLICY IF EXISTS "Acceso a perfiles" ON public.profiles;
CREATE POLICY "Acceso a perfiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      auth.uid() = id
      OR
      (SELECT user_role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    )
  );

-- Permitir inserción al registrarse
CREATE POLICY "Permitir inserción de perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. Políticas para orders
-- ============================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Los admins ven todos los pedidos, los clientes solo los suyos
DROP POLICY IF EXISTS "Acceso a pedidos" ON public.orders;
CREATE POLICY "Acceso a pedidos"
  ON public.orders
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      auth.uid() = usuario_id
      OR
      (SELECT user_role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    )
  );

-- Cualquier usuario autenticado puede crear pedidos
DROP POLICY IF EXISTS "Crear pedidos" ON public.orders;
CREATE POLICY "Crear pedidos"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
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

| Ruta               | Componente      | Descripción                               | Requiere Auth |
|--------------------|-----------------|-------------------------------------------|---------------|
| `/`                | LandingPage     | Página de bienvenida temática             | ❌            |
| `/Login`           | Login           | Inicio de sesión                          | ❌            |
| `/Registro`        | Register        | Registro de nuevo usuario                 | ❌            |
| `/Shop`            | ShopPage        | Tienda con catálogo y paginación          | ❌ (solo ver) |
| `/cart`            | Cart            | Carrito de compras completo               | ❌ (solo ver) |
| `/orders`          | OrdersHistory   | Historial de pedidos del usuario          | ✅            |
| `/orders/:id`      | OrderDetail     | Detalle de un pedido específico           | ✅            |
| `/admin`           | AdminPage       | Dashboard de administración               | ✅ (admin)    |
| `/admin/clientes`  | ClientList      | Listado de clientes (solo admin)          | ✅ (admin)    |

---

## 📦 API de Productos

El catálogo de productos se obtiene desde la API pública **DummyJSON**:

```
https://dummyjson.com/products/category/groceries?limit=30
```

**Estructura del JSON:**
```json
{
  "products": [
    {
      "id": 16,
      "title": "Apple",
      "price": 1.99,
      "category": "groceries",
      "stock": 8,
      "thumbnail": "https://cdn.dummyjson.com/.../thumbnail.webp",
      "images": ["https://cdn.dummyjson.com/.../1.webp"]
    }
  ],
  "total": 27
}
```

Los precios se convierten de USD a COP usando la tasa 1 USD = $4,200 COP.

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos como parte del **Taller de React** del Sena. Todos los derechos de *Stardew Valley* pertenecen a **ConcernedApe**.