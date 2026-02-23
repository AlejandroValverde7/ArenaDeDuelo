// Mago.ts
import { Personaje } from "./Personaje.js";
import { Dados } from "./Dados.js";
export class Mago extends Personaje {
    mana = 0;
    maxMana = 5;
    constructor(nombre, fuerza, mana = 0) {
        super(nombre, fuerza);
        this.mana = mana;
        this.recuperarMana();
    }
    // Ataque sobrescrito
    atacar(objetivo) {
        if (!this.estaVivo()) {
            console.log(`${this.nombre} no puede atacar porque está muerto.`);
            return 0;
        }
        if (this.mana > 0) {
            const daño = Dados.generarNumeroAleatorio(1, this.fuerza + 2 * this.mana);
            console.log(`${this.nombre} lanza un hechizo causando ${daño} de daño.`);
            objetivo.recibirDano(daño);
            this.mana--;
            return daño; // ← IMPORTANTE
        }
        else {
            console.log(`${this.nombre} no tiene maná. Ataque básico.`);
            return super.atacar(objetivo); // ← devuelve daño del padre
        }
    }
    // Recuperación automática de maná
    recuperarMana() {
        setInterval(() => {
            if (this.mana < this.maxMana) {
                this.mana++;
                console.log(`${this.nombre} recupera 1 punto de maná. (Mana: ${this.mana})`);
            }
        }, 20000);
    }
}
//# sourceMappingURL=Mago.js.map