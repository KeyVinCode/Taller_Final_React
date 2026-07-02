/**
 * Script para descargar las imágenes de Stardew Valley desde la wiki
 * y guardarlas localmente en el proyecto.
 * 
 * Uso: node download-images.cjs
 * 
 * Descarga las 30 imágenes y las coloca en public/images/
 * con el nombre "1.png", "2.png", etc. (según el ID del producto).
 * 
 * Si la descarga falla (CORS o 404), genera un SVG placeholder
 * con el nombre del producto como texto.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const URL_API =
  "https://gist.githubusercontent.com/KeyVinCode/58157ab9d21609f9b85f0bd327109da9/raw/29b60ddcb6aa29f611d78b5f9a384ac38a46f54c/productos.json";

const CARPETA_DESTINO = path.join(__dirname, "public", "images");

// Asegurar que la carpeta existe
if (!fs.existsSync(CARPETA_DESTINO)) {
  fs.mkdirSync(CARPETA_DESTINO, { recursive: true });
  console.log("📁 Carpeta public/images/ creada");
}

/**
 * Corrige la URL de la wiki: cambia "Mediawiki" (M mayúscula) por "mediawiki" (minúscula)
 * y asegura que el protocolo sea https
 */
function corregirURL(url) {
  return url
    .replace(/\/\//g, "//") // no tocar dobles //
    .replace(/Mediawiki\//gi, "mediawiki/") // corregir mayúsculas
    .replace(/^http:\/\//, "https://"); // forzar https
}

/**
 * Descarga una imagen desde una URL y la guarda en un archivo
 */
function descargarImagen(url, filepath) {
  return new Promise((resolve, reject) => {
    const urlCorregida = corregirURL(url);
    
    https
      .get(urlCorregida, { timeout: 10000 }, (response) => {
        // Manejar redirecciones (301, 302)
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          descargarImagen(response.headers.location, filepath)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(
            new Error(`HTTP ${response.statusCode}`)
          );
          return;
        }

        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
        fileStream.on("error", reject);
      })
      .on("error", reject)
      .on("timeout", function() {
        this.destroy();
        reject(new Error("Timeout"));
      });
  });
}

/**
 * Genera un SVG placeholder con el nombre del producto en lugar de la imagen,
 * usando los colores temáticos de Stardew Valley.
 */
function generarSVGPlaceholder(nombre, id) {
  const nombreLimpiado = nombre || "Producto";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#15803d"/>
  <rect x="10" y="10" width="280" height="280" rx="10" fill="#fef3c7" opacity="0.15"/>
  <text x="150" y="130" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="bold" fill="#fef3c7" text-anchor="middle" dominant-baseline="middle">${escapeXml(nombreLimpiado)}</text>
  <text x="150" y="170" font-family="'Courier New', Courier, monospace" font-size="11" fill="#fef3c7" text-anchor="middle" opacity="0.7">Item #${id}</text>
</svg>`;
  return svg;
}

function escapeXml(texto) {
  return texto
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/'/g, "'");
}

/**
 * Obtiene el JSON de productos desde la API
 */
function obtenerProductos() {
  return new Promise((resolve, reject) => {
    https
      .get(URL_API, { timeout: 15000 }, (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("🌾 Descargando imágenes de Stardew Valley...\n");

  try {
    const productos = await obtenerProductos();
    console.log(`📦 Se encontraron ${productos.length} productos\n`);

    let exitos = 0;
    let errores = 0;
    let placeholders = 0;

    for (const producto of productos) {
      const nombreArchivo = `${producto.id}.svg`;
      const rutaArchivo = path.join(CARPETA_DESTINO, nombreArchivo);

      // Si ya existe, lo saltamos
      if (fs.existsSync(rutaArchivo)) {
        console.log(`  ⏭️  [${producto.id}] ${producto.nombre} — ya existe`);
        continue;
      }

      // Intentamos descargar desde la wiki
      try {
        console.log(`  ⬇️  [${producto.id}] ${producto.nombre}...`);
        
        // Intentar con .png primero
        const rutaPNG = path.join(CARPETA_DESTINO, `${producto.id}.png`);
        await descargarImagen(producto.imagen, rutaPNG);
        console.log(`  ✅ [${producto.id}] Descargada como PNG!`);
        exitos++;
      } catch (error) {
        // Si falla la descarga, generamos un SVG placeholder
        console.log(`  🎨 [${producto.id}] Generando SVG placeholder...`);
        const svg = generarSVGPlaceholder(producto.nombre, producto.id);
        fs.writeFileSync(rutaArchivo, svg);
        console.log(`  ✅ [${producto.id}] SVG creado: ${producto.nombre}`);
        placeholders++;
        errores++;
      }

      // Pequeña pausa para no sobrecargar
      await new Promise((r) => setTimeout(r, 300));
    }

    console.log("\n═══════════════════════════════════");
    console.log(`📊 Resumen:`);
    console.log(`   ✅ Descargadas (PNG): ${exitos}`);
    console.log(`   🎨 Placeholders (SVG): ${placeholders}`);
    console.log(`   📁 Ubicación:   ${CARPETA_DESTINO}`);
    console.log("═══════════════════════════════════\n");

    if (exitos > 0 || placeholders > 0) {
      console.log("✅ ¡Listo! Ahora las imágenes se cargarán desde archivos locales.");
      console.log("   No dependes de CORS ni de servidores externos.");
    }
  } catch (error) {
    console.error("💥 Error general:", error.message);
  }
}

main();