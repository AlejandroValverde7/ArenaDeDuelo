// Dados.ts
export class Dados {
    // Método estático
    static generarNumeroAleatorio(min, max) {
        const aleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
        // Regla especial del ejercicio
        const umbral = Math.floor((min + max) / 2) + 1;
        if (aleatorio >= umbral) {
            return aleatorio; // Daño exitoso
        }
        return 0; // Ataque fallido
    }
}
//# sourceMappingURL=Dados.js.map