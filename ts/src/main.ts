    // Importaciones
    import { Guerrero } from "./personajes/Guerrero.js";
    import { Mago } from "./personajes/Mago.js";
    import { Personaje } from "./personajes/Personaje.js";

    // Conexiones del DOM
    const form = document.getElementById("form-personaje") as HTMLFormElement;
    const contenedor = document.getElementById("personajes") as HTMLDivElement;
    const logDiv = document.getElementById("log-texto") as HTMLDivElement;

    const selectClase = document.getElementById("clase") as HTMLSelectElement;
    const campoArmadura = document.getElementById("campo-armadura") as HTMLDivElement;
    const campoMana = document.getElementById("campo-mana") as HTMLDivElement;

    // Variables
    let personajes: Personaje[] = [];
    let turno = 0;
    const musica = document.getElementById("musica-fondo") as HTMLAudioElement;
    let musicaIniciada = false;


    /**
     * Funcion para mostrar los logs en el registro de batalla
     * @param mensaje Mensaje que se quiere mostrar en el registro
     * @param clase clase que se quiere añadir al log para decorar
     */
    function log(mensaje: string, clase: string = ""):void {
        const p = document.createElement("p");
        p.textContent = mensaje;

        if (clase) p.classList.add(clase);

        logDiv.appendChild(p);
    }


    /**
     * Añade una tarjeta de combate al DOM, ademas
     * actualiza los botones de ataque
     * @param personaje 
     * @returns Devuelve el div
     */
    function crearTarjeta(personaje: Personaje):HTMLDivElement {
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

    /**
     * Funcion para actualizar los botones de ataque
     */
    function actualizarBotonesDeAtaque() {
        const tarjetas = contenedor.querySelectorAll(".tarjeta");

        tarjetas.forEach((tarjeta, i) => {
            const contenedorAtaques = tarjeta.querySelector(".ataques") as HTMLDivElement;
            contenedorAtaques.innerHTML = ""; // limpiar botones actuales

            personajes.forEach((objetivo, j) => {
                if (i === j) return; // para que no se ataque a si mismo
                if (!objetivo.estaVivo()) return; // para no atacar a los muertos

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

    /**
     * Funcion que controla los ataques, se les indica el numero del atacante y el objetivo
     * y puede fallarse o acertarse el ataque
     * @param atacanteIndex index del array que indica al atacante
     * @param objetivoIndex index del array que indica al que atacan
     */
    function realizarAtaque(atacanteIndex: number, objetivoIndex: number):void {
        const atacante = personajes[atacanteIndex];
        const objetivo = personajes[objetivoIndex];

        const daño = atacante.atacar(objetivo);
        const esHechizo = atacante instanceof Mago;

        // Animación para indicar quien toca atacar
        animarAtaque(atacanteIndex, esHechizo);

        if (daño === 0) {
            log(`${atacante.nombre} falló el ataque contra ${objetivo.nombre}.`, "log-fallo");
        } else {
            log(
                `${atacante.nombre} ataca a ${objetivo.nombre} y le hace ${daño} de daño. Vida restante: ${objetivo.vida}`,
                esHechizo ? "log-hechizo" : "log-dano"
            );
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

    /**
     * Funcion para el cambio de turnos
     */
    function avanzarTurno():void {
        do {
            turno = (turno + 1) % personajes.length;
        } while (!personajes[turno].estaVivo());
    }


    /**
     * Funcion para actualizar las tarjetas viendo si el personaje
     * esta vivo,muerto, y los cambios en las barras de vida y mana
     */
    function actualizarTarjetas() :void {
        const tarjetas = contenedor.querySelectorAll(".tarjeta");

        tarjetas.forEach((tarjeta, i) => {
            const personaje = personajes[i];

            // Vida
            const barraVida = tarjeta.querySelector(".vida-bar") as HTMLProgressElement;
            barraVida.value = personaje.vida;

            // Maná (solo si existe)
            const barraMana = tarjeta.querySelector(".mana-bar") as HTMLProgressElement;
            if (barraMana) {
                barraMana.value = (personaje as Mago).mana;
            }


            // Muerto
            if (!personaje.estaVivo()) {
                tarjeta.classList.add("muerto");
                const btn = tarjeta.querySelector("button") as HTMLButtonElement;
                if (btn) btn.disabled = true;
            }
        });
    }

    /**
     * Funcion para actualizar los turnos
     */
    function actualizarTurnos() {
        const tarjetas = contenedor.querySelectorAll(".tarjeta");

        tarjetas.forEach((tarjeta, index) => {
            const personaje = personajes[index];
            const botones = tarjeta.querySelectorAll(".btn-atacar");

            const esSuTurno = index === turno; //Si el indice es igual al turno es su turno
            const estaVivo = personaje.estaVivo();
            const puedeAtacar = esSuTurno && estaVivo;

            botones.forEach(btn => {
                (btn as HTMLButtonElement).disabled = !puedeAtacar;
            });

            // toggle añade el classlist si esSuTurno es true si no lo quita
            tarjeta.classList.toggle("turno", esSuTurno);
        });
    }

    // Formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const fuerza = Number((document.getElementById("fuerza") as HTMLInputElement).value);
        const clase = selectClase.value;

        let nuevo: Personaje;

        if (clase === "Guerrero") {
            const armadura = Number((document.getElementById("armadura") as HTMLInputElement).value) || 3;
            nuevo = new Guerrero(nombre, fuerza, armadura);
        } else {
            const mana = Number((document.getElementById("mana") as HTMLInputElement).value) || 0;
            nuevo = new Mago(nombre, fuerza, mana);
        }

        personajes.push(nuevo);
        crearTarjeta(nuevo);

        // Iniciar música al crear el primer personaje
        if (!musicaIniciada) {
            musicaIniciada = true;
            musica.volume = 0.1; //Damos valor para no reventar los oidos
            musica.muted = false; // activamos el sonido
            musica.play().catch(() => {
                console.log("El navegador requiere interacción del usuario para reproducir audio.");
            });
        }   


        actualizarTurnos();
    });

    /**
     * Se muestran las variantes para crear un guerrero o un mago segun el campo elegido
     */
    selectClase.addEventListener("change", () => {
        if (selectClase.value === "Guerrero") {
            campoArmadura.style.display = "block";
            campoMana.style.display = "none";
        } else {
            campoArmadura.style.display = "none";
            campoMana.style.display = "block";
        }
    });

    // Por defecto
    campoArmadura.style.display = "block";
    campoMana.style.display = "none";


    /**
     * Funcion para añadir una animacion al pulsar el boton de ataque, se muestra
     * segun sea un hechizo o no un sonido y una imagen
     * @param index lugar en el que se realiza la animacion
     * @param esHechizo si es hechizo o no para la animacion
     */
    function animarAtaque(index: number, esHechizo: boolean) : void {
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
