import { Guerrero } from "./personajes/Guerrero.js";
import { Mago } from "./personajes/Mago.js";
// DOM
const form = document.getElementById("form-personaje");
const contenedor = document.getElementById("personajes");
const logDiv = document.getElementById("log-texto");
const selectClase = document.getElementById("clase");
const campoArmadura = document.getElementById("campo-armadura");
const campoMana = document.getElementById("campo-mana");
// Variables
let personajes = [];
let turno = 0;
const musica = document.getElementById("musica-fondo");
let musicaIniciada = false;
// Log
function log(mensaje, clase = "") {
    const p = document.createElement("p");
    p.textContent = mensaje;
    if (clase)
        p.classList.add(clase);
    logDiv.appendChild(p);
    logDiv.scrollTop = logDiv.scrollHeight;
}
// Crear tarjeta
function crearTarjeta(personaje) {
    const div = document.createElement("div");
    div.classList.add("tarjeta");
    div.innerHTML = `
        <h3>${personaje.nombre}</h3>
        <p>Clase: ${personaje.constructor.name}</p>
        <progress max="100" value="${personaje.vida}" class="vida-bar"></progress>

        ${personaje instanceof Mago ? `
        <progress max="5" value="${personaje.mana}" class="mana-bar"></progress>
    ` : ""}


        <div class="ataques"></div>
    `;
    contenedor.appendChild(div);
    actualizarBotonesDeAtaque();
    return div;
}
function actualizarBotonesDeAtaque() {
    const tarjetas = contenedor.querySelectorAll(".tarjeta");
    tarjetas.forEach((tarjeta, i) => {
        const contenedorAtaques = tarjeta.querySelector(".ataques");
        contenedorAtaques.innerHTML = ""; // limpiar botones
        personajes.forEach((objetivo, j) => {
            if (i === j)
                return; // no puede atacarse a sí mismo
            if (!objetivo.estaVivo())
                return; // no atacar muertos
            const btn = document.createElement("button");
            btn.textContent = `Atacar a ${objetivo.nombre}`;
            btn.classList.add("btn-atacar");
            btn.addEventListener("click", () => {
                realizarAtaque(i, j);
            });
            contenedorAtaques.appendChild(btn);
        });
    });
    actualizarTurnos();
}
function realizarAtaque(atacanteIndex, objetivoIndex) {
    const atacante = personajes[atacanteIndex];
    const objetivo = personajes[objetivoIndex];
    const daño = atacante.atacar(objetivo);
    const esHechizo = atacante instanceof Mago;
    animarAtaque(atacanteIndex, esHechizo);
    // Animación de temblor en el objetivo
    const tarjetaObjetivo = contenedor.querySelectorAll(".tarjeta")[objetivoIndex];
    tarjetaObjetivo.classList.add("hit");
    setTimeout(() => tarjetaObjetivo.classList.remove("hit"), 300);
    if (daño === 0) {
        log(`${atacante.nombre} falló el ataque contra ${objetivo.nombre}.`, "log-fallo");
    }
    else {
        log(`${atacante.nombre} ataca a ${objetivo.nombre} y le hace ${daño} de daño. Vida restante: ${objetivo.vida}`, esHechizo ? "log-hechizo" : "log-dano");
    }
    actualizarTarjetas();
    if (!objetivo.estaVivo()) {
        log(`${objetivo.nombre} ha muerto.`, "log-muerte");
        const sonidoMuerte = new Audio("../../resources/audio/sonidoMuerte.mp3");
        sonidoMuerte.volume = 0.5;
        sonidoMuerte.play();
    }
    avanzarTurno();
    actualizarBotonesDeAtaque();
}
function avanzarTurno() {
    do {
        turno = (turno + 1) % personajes.length;
    } while (!personajes[turno].estaVivo());
}
// Actualizar tarjetas
function actualizarTarjetas() {
    const tarjetas = contenedor.querySelectorAll(".tarjeta");
    tarjetas.forEach((tarjeta, i) => {
        const personaje = personajes[i];
        // Vida
        const barraVida = tarjeta.querySelector(".vida-bar");
        barraVida.value = personaje.vida;
        // Maná (solo si existe)
        const barraMana = tarjeta.querySelector(".mana-bar");
        if (barraMana) {
            barraMana.value = personaje.mana;
        }
        // Muerto
        if (!personaje.estaVivo()) {
            tarjeta.classList.add("muerto");
            const btn = tarjeta.querySelector("button");
            if (btn)
                btn.disabled = true;
        }
    });
}
// Turnos
function actualizarTurnos() {
    const tarjetas = contenedor.querySelectorAll(".tarjeta");
    tarjetas.forEach((tarjeta, index) => {
        const personaje = personajes[index];
        const botones = tarjeta.querySelectorAll(".btn-atacar");
        const esSuTurno = index === turno;
        const estaVivo = personaje.estaVivo();
        const puedeAtacar = esSuTurno && estaVivo;
        botones.forEach(btn => {
            btn.disabled = !puedeAtacar;
        });
        // Indicador visual del turno (llamas)
        tarjeta.classList.toggle("turno", esSuTurno);
    });
}
// Formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const fuerza = Number(document.getElementById("fuerza").value);
    const clase = selectClase.value;
    let nuevo;
    if (clase === "Guerrero") {
        const armadura = Number(document.getElementById("armadura").value) || 3;
        nuevo = new Guerrero(nombre, fuerza, armadura);
    }
    else {
        const mana = Number(document.getElementById("mana").value) || 0;
        nuevo = new Mago(nombre, fuerza, mana);
    }
    personajes.push(nuevo);
    crearTarjeta(nuevo);
    // Iniciar música al crear el primer personaje
    if (!musicaIniciada) {
        musicaIniciada = true;
        musica.volume = 0.1; //Damos valor para no reventar los oidos
        musica.muted = false; // activar sonido
        musica.play().catch(() => {
            console.log("El navegador requiere interacción del usuario para reproducir audio.");
        });
    }
    actualizarTurnos();
});
// Mostrar campos dinámicos
selectClase.addEventListener("change", () => {
    if (selectClase.value === "Guerrero") {
        campoArmadura.style.display = "block";
        campoMana.style.display = "none";
    }
    else {
        campoArmadura.style.display = "none";
        campoMana.style.display = "block";
    }
});
// Por defecto
campoArmadura.style.display = "block";
campoMana.style.display = "none";
function animarAtaque(index, esHechizo) {
    const tarjeta = contenedor.querySelectorAll(".tarjeta")[index];
    const img = document.createElement("img");
    img.src = esHechizo ? "../../resources/weapons/baculo.png" : "../../resources/weapons/espada.webp";
    img.classList.add("anim-ataque");
    tarjeta.appendChild(img);
    // Sonido
    const sonido = esHechizo ? new Audio("../../resources/audio/ataqueMagia.m4a") : new Audio("../../resources/audio/ataqueEspada.m4a");
    sonido.volume = 0.4;
    sonido.play();
    // Eliminar animación después de reproducirse
    setTimeout(() => img.remove(), 600);
}
//# sourceMappingURL=main.js.map