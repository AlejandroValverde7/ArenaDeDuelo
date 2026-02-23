// Personaje.ts
import { Dados } from "./Dados.js";
export class Personaje {
    nombre;
    fuerza;
    #vida = 100; // Vida privada
    constructor(nombre, fuerza) {
        this.nombre = nombre;
        this.fuerza = fuerza;
    }
    // Getter para leer la vida sin modificarla
    get vida() {
        return this.#vida;
    }
    // Saber si está vivo
    estaVivo() {
        return this.#vida > 0;
    }
    // Recibir daño
    recibirDano(cantidad) {
        this.#vida -= cantidad;
        if (this.#vida < 0)
            this.#vida = 0;
        if (this.#vida === 0) {
            console.log(`${this.nombre} ha muerto.`);
        }
    }
    // Atacar a otro personaje
    atacar(objetivo) {
        if (!this.estaVivo()) {
            console.log(`${this.nombre} no puede atacar porque está muerto.`);
            return 0;
        }
        const daño = Dados.generarNumeroAleatorio(1, this.fuerza);
        console.log(`${this.nombre} ataca a ${objetivo.nombre} causando ${daño} de daño.`);
        objetivo.recibirDano(daño);
        return daño;
    }
}
//# sourceMappingURL=Personaje.js.map