// ===== Colorfly Studio · Generador de paletas v2 =====
const CLAVE_STORAGE = "colorfly-paletas";
const MAX_GUARDADAS = 8;
 
// Referencias al DOM
const selTamano = document.getElementById("tamano");
const selFormato = document.getElementById("formato");
const btnGenerar = document.getElementById("btn-generar");
const btnGuardar = document.getElementById("btn-guardar");
const btnBorrar = document.getElementById("btn-borrar");
const contenedor = document.getElementById("paleta");
const listaGuardadas = document.getElementById("lista-guardadas");
const sinGuardadas = document.getElementById("sin-guardadas");
const toast = document.getElementById("toast");
 
// Estado: array de objetos { hex, detalle, bloqueado }
let paleta = [];
let temporizadorToast;
 
/* ---------- Utilidades de color ---------- */
function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function hslAHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const valor = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * valor).toString(16).padStart(2, "0");
  };
  return ("#" + f(0) + f(8) + f(4)).toUpperCase();
}
 
function canalAHex(n) {
  return n.toString(16).padStart(2, "0");
}
 
// Luminancia relativa según WCAG
function luminancia(hex) {
  const canales = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2];
}
 
// Elige texto blanco o negro, el que tenga mayor contraste con el fondo
function colorTexto(hex) {
  const l = luminancia(hex);
  const contrasteBlanco = 1.05 / (l + 0.05);
  const contrasteNegro = (l + 0.05) / 0.05;
  return contrasteBlanco > contrasteNegro ? "#FFFFFF" : "#000000";
}
 
/* ---------- Generación ---------- */
function nuevoColor(formato) {
  if (formato === "hsl") {
    const h = aleatorio(0, 359);
    const s = aleatorio(35, 95);
    const l = aleatorio(25, 80);
    return { hex: hslAHex(h, s, l), detalle: "hsl(" + h + ", " + s + "%, " + l + "%)", bloqueado: false };
  }
  if (formato === "rgba") {
    const r = aleatorio(0, 255);
    const g = aleatorio(0, 255);
    const b = aleatorio(0, 255);
    const hex = ("#" + canalAHex(r) + canalAHex(g) + canalAHex(b)).toUpperCase();
    return { hex: hex, detalle: "rgba(" + r + ", " + g + ", " + b + ", 1)", bloqueado: false };
  }
  // Formato HEX: se genera un número aleatorio de 6 dígitos hexadecimales
  const hex = "#" + aleatorio(0, 0xffffff).toString(16).padStart(6, "0").toUpperCase();
  return { hex: hex, detalle: "", bloqueado: false };
}
 
function generarPaleta() {
  const cantidad = Number(selTamano.value);
  const formato = selFormato.value;
  const anterior = paleta;
  // Mantiene los colores bloqueados en su posición
  paleta = Array.from({ length: cantidad }, (_, i) =>
    anterior[i] && anterior[i].bloqueado ? anterior[i] : nuevoColor(formato)
  );
  console.log("Paleta generada:", paleta);
  mostrarPaleta();
  mostrarToast("Paleta generada");
}
 
/* ---------- Render ---------- */
function mostrarPaleta() {
  contenedor.innerHTML = "";
  contenedor.dataset.cantidad = paleta.length;
 
  paleta.forEach((color, indice) => {
    const item = document.createElement("li");
    item.className = "tarjeta";
 
    const btnColor = document.createElement("button");
    btnColor.type = "button";
    btnColor.className = "color";
    // Las variables viven en la tarjeta; el botón las hereda y el resplandor usa el mismo color
    item.style.setProperty("--fondo-color", color.hex);
    item.style.setProperty("--texto-color", colorTexto(color.hex));
    btnColor.setAttribute("aria-label", "Copiar el color " + color.hex);
    btnColor.innerHTML = "<span>" + color.hex + "</span>" + (color.detalle ? "<small>" + color.detalle + "</small>" : "");
    btnColor.addEventListener("click", () => copiar(color.hex));
 
    const btnBloqueo = document.createElement("button");
    btnBloqueo.type = "button";
    btnBloqueo.className = "bloqueo";
    btnBloqueo.textContent = color.bloqueado ? "Bloqueado" : "Bloquear";
    btnBloqueo.setAttribute("aria-pressed", String(color.bloqueado));
    btnBloqueo.setAttribute("aria-label", "Bloquear el color " + color.hex);
    btnBloqueo.addEventListener("click", () => alternarBloqueo(indice, btnBloqueo));
 
    item.append(btnColor, btnBloqueo);
    contenedor.appendChild(item);
  });
}
 
function alternarBloqueo(indice, boton) {
  const color = paleta[indice];
  color.bloqueado = !color.bloqueado;
  // Solo se actualiza el botón: no se redibuja la paleta y el foco se mantiene
  boton.textContent = color.bloqueado ? "Bloqueado" : "Bloquear";
  boton.setAttribute("aria-pressed", String(color.bloqueado));
  mostrarToast(color.bloqueado ? "Color bloqueado" : "Color desbloqueado");
}
 
/* ---------- Microfeedback ---------- */
function mostrarToast(texto) {
  toast.textContent = texto;
  toast.classList.add("visible");
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => toast.classList.remove("visible"), 1800);
}
 
async function copiar(hex) {
  try {
    await navigator.clipboard.writeText(hex);
    mostrarToast("Copiado: " + hex);
  } catch (error) {
    console.error("Error al copiar:", error);
    mostrarToast("No se pudo copiar " + hex);
  }
}
 
/* ---------- localStorage ---------- */
function leerGuardadas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
  } catch (error) {
    console.error("Error al leer localStorage:", error);
    return [];
  }
}
 
function escribirGuardadas(lista) {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
  } catch (error) {
    console.error("Error al guardar:", error);
    mostrarToast("No se pudo guardar");
  }
}
 
function guardarPaleta() {
  const lista = leerGuardadas();
  lista.unshift(paleta.map((c) => ({ hex: c.hex, detalle: c.detalle, bloqueado: false })));
  escribirGuardadas(lista.slice(0, MAX_GUARDADAS));
  mostrarGuardadas();
  mostrarToast("Paleta guardada");
}
 
function mostrarGuardadas() {
  const lista = leerGuardadas();
  listaGuardadas.innerHTML = "";
  sinGuardadas.hidden = lista.length > 0;
  btnBorrar.hidden = lista.length === 0;
 
  lista.forEach((colores, indice) => {
    const item = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "guardada";
    btn.setAttribute("aria-label", "Cargar paleta guardada " + (indice + 1) + ": " + colores.map((c) => c.hex).join(", "));
    colores.forEach((c) => {
      const franja = document.createElement("span");
      franja.style.setProperty("--fondo-color", c.hex);
      btn.appendChild(franja);
    });
    btn.addEventListener("click", () => cargarPaleta(colores));
    item.appendChild(btn);
    listaGuardadas.appendChild(item);
  });
}
 
function cargarPaleta(colores) {
  paleta = colores.map((c) => ({ ...c }));
  if ([...selTamano.options].some((o) => Number(o.value) === paleta.length)) {
    selTamano.value = String(paleta.length);
  }
  mostrarPaleta();
  mostrarToast("Paleta cargada");
}
 
function borrarGuardadas() {
  escribirGuardadas([]);
  mostrarGuardadas();
  mostrarToast("Paletas borradas");
}
 
/* ---------- Eventos ---------- */
btnGenerar.addEventListener("click", generarPaleta);
btnGuardar.addEventListener("click", guardarPaleta);
btnBorrar.addEventListener("click", borrarGuardadas);
selTamano.addEventListener("change", generarPaleta);
selFormato.addEventListener("change", () => mostrarToast("Formato: " + selFormato.options[selFormato.selectedIndex].text));
 
generarPaleta();
mostrarGuardadas();