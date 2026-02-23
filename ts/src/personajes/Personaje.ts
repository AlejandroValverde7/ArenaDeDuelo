// Personaje.ts
import { Dados } from "./Dados.js";

export class Personaje {

    public nombre: string;
    public fuerza: number;
    #vida: number = 100; // Vida privada

    constructor(nombre: string, fuerza: number) {
        this.nombre = nombre;
        this.fuerza = fuerza;
    }

    // Getter para leer la vida sin modificarla
    public get vida(): number {
        return this.#vida;
    }

    // Saber si está vivo
    public estaVivo(): boolean {
        return this.#vida > 0;
    }

    // Recibir daño
    public recibirDano(cantidad: number): void {
        this.#vida -= cantidad;

        if (this.#vida < 0) this.#vida = 0;

        if (this.#vida === 0) {
            console.log(`${this.nombre} ha muerto.`);
        }
    }

    // Atacar a otro personaje
    public atacar(objetivo: Personaje): number {

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
