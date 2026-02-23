// Guerrero.ts
import { Personaje } from "./Personaje.js";
export class Guerrero extends Personaje {
    armadura = 3;
    constructor(nombre, fuerza, armadura = 3) {
        super(nombre, fuerza);
        this.armadura = armadura;
    }
    // Sobrescribe recibirDaño
    recibirDano(cantidad) {
        const dañoReducido = Math.max(0, cantidad - this.armadura);
        console.log(`${this.nombre} recibe ${dañoReducido} de daño (armadura redujo ${cantidad - dañoReducido}).`);
        super.recibirDano(dañoReducido);
    }
}
//# sourceMappingURL=Guerrero.js.map