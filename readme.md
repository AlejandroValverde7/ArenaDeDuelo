# 🛡️⚔️ Sistema de Duelo entre Personajes

Un juego interactivo desarrollado en **TypeScript**, donde varios personajes pueden enfrentarse en duelos por turnos. Cada personaje posee atributos únicos, ataques diferenciados y animaciones visuales y sonoras que hacen que el combate sea dinámico y entretenido.

---

## 🚀 Tecnologías utilizadas

- **TypeScript** – Tipado fuerte, clases, herencia y mejor mantenimiento del código.  
- **HTML + CSS** – Interfaz visual, tarjetas de personajes y barras de estado.  
- **JavaScript (compilado desde TS)** – Ejecución en el navegador.  
- **Audio y animaciones CSS** – Efectos de ataque, hechizos y música de fondo.

---

## 🎮 ¿Cómo funciona el juego?

### 1. Creación de personajes

El usuario puede crear tantos personajes como desee mediante un formulario que solicita:

- Nombre  
- Fuerza  
- Clase (Guerrero o Mago)

Según la clase seleccionada, se muestran campos dinámicos:

- **Guerrero** → Armadura  
- **Mago** → Maná  

Esto se gestiona mediante un evento `change` en el `<select>` que alterna la visibilidad de los campos.

---

### 2. Sistema de combate

Cada personaje aparece en una tarjeta con:

- Nombre  
- Clase  
- Barra de vida  
- Barra de maná (solo magos)  
- Botones para atacar a otros personajes vivos  

El combate es **por turnos**, y solo el personaje activo puede atacar.

---

### 3. Ataques

Cada ataque:

- Llama al método `atacar()` del personaje  
- Puede fallar o acertar  
- Aplica daño según la clase  
- Actualiza barras de vida y maná  
- Reproduce un sonido  
- Muestra una animación (espada o báculo)  
- Registra la acción en el log de batalla  

Cuando un personaje muere:

- Su tarjeta se marca como *muerto*  
- Sus botones se desactivan  
- Se reproduce un sonido de muerte  

---

### 4. Turnos

El turno avanza automáticamente después de cada ataque:

- Se salta a personajes muertos  
- Se resalta la tarjeta del personaje activo  
- Solo ese personaje puede atacar  

---

### 5. Música de fondo

La música comienza automáticamente al crear el primer personaje.  
Se controla para evitar errores por restricciones del navegador.

---

## 📁 Estructura del proyecto

ArenaDeDuelo:.
├───css
├───html
├───js
│   └───src
│       └───personajes
├───resources
│   ├───audio
│   ├───gifs
│   └───weapons
└───ts
    └───src
        └───personajes