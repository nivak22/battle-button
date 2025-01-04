const socket = io('http://localhost:3000');



// Elementos del DOM

const pantallaPrincipal = document.getElementById('pantallaPrincipal');

const pantallaEspera = document.getElementById('pantallaEspera');

const pantallaJuego = document.getElementById('pantallaJuego');

const crearSalaBtn = document.getElementById('crearSala');

const unirseSalaBtn = document.getElementById('unirseSala');

const codigoSalaInput = document.getElementById('codigoSala');

const iniciarJuegoBtn = document.getElementById('iniciarJuego');

const botonPresionar = document.getElementById('botonPresionar');

const contadorJuego = document.getElementById('contador');

const nombreUsuarioInput = document.getElementById('nombreUsuario');

const errorNombreSpan = document.getElementById('errorNombre');



// Sala de espera

const salirSalaBtn = document.getElementById('salirSala');

const copiarCodigoBtn = document.getElementById('copiarCodigo');

const codigoSalaTexto = document.getElementById('codigoSalaTexto');

const listaAzul = document.getElementById('listaAzul');

const listaRojo = document.getElementById('listaRojo');

const esperaFooter = document.getElementById('espera-footer');

const esperaContainer = document.getElementById('espera-container');

const unirmeAzulBtn = document.getElementById('unirmeAzul');

const unirmeRojoBtn = document.getElementById('unirmeRojo');
let codigoSalaActual = null; // Variable para almacenar el código de la sala


//juego

// Nuevas variables para las listas en la pantalla de juego

const listaAzulJuego = document.getElementById('listaAzulJuego');

const listaRojoJuego = document.getElementById('listaRojoJuego');

const preguntaContainer = document.getElementById('pregunta-container');

const contadorContainer = document.getElementById('contador-container')


//variables para juego
const respuestasContainer = document.getElementById('respuestas-container'); // Nuevo contenedor para las respuestas
let botonesRespuesta = []; // Array para almacenar los botones de respuesta
let botonPresionado = false; // Variable para controlar si ya se presionó el botón principal
let jugadoresEnSala = {}; // Almacenar la información de los jugadores en el cliente
const puntuacionAzulPantalla = document.getElementById('puntuacionAzul');
const puntuacionRojoPantalla = document.getElementById('puntuacionRojo');
const mensajesVeloz = document.querySelectorAll('.mensaje-veloz'); // Selecciona todos los mensajes
let contadorActivo = false; // Variable para controlar si el contador está activo
// Inicializar con la pantalla principal
document.addEventListener('DOMContentLoaded', () => {
    mostrarPantalla(pantallaPrincipal);
});


function mostrarPantalla(pantallaAmostrar) {
    // Ocultar todas las pantallas
    pantallaPrincipal.style.display = 'none';
    pantallaEspera.style.display = 'none';
    pantallaJuego.style.display = 'none';

    // Mostrar la pantalla seleccionada
    pantallaAmostrar.style.display = 'block';
}


socket.on('obtener jugadores', (jugadoresEnSalaActualizados) => {
    jugadoresEnSala = jugadoresEnSalaActualizados; // Actualizar la variable local
    listaAzul.innerHTML = '';
    listaRojo.innerHTML = '';
    listaAzulJuego.innerHTML = '';
    listaRojoJuego.innerHTML = '';

    for (const jugadorId in jugadoresEnSala) {
        const jugador = jugadoresEnSala[jugadorId];
        const jugadorElemento = document.createElement('li');
        jugadorElemento.textContent = jugador.nombre || `Jugador ${jugador.id}`;
        if (jugador.equipo === 'equipoAzul') {
            listaAzul.appendChild(jugadorElemento);
            listaAzulJuego.appendChild(jugadorElemento.cloneNode(true));
        } else if (jugador.equipo === 'equipoRojo') {
            listaRojo.appendChild(jugadorElemento);
            listaRojoJuego.appendChild(jugadorElemento.cloneNode(true));
        }
    }
});



const salirJuegoBtn = document.getElementById('salirJuego');

salirJuegoBtn.addEventListener('click', () => {
    if (codigoSalaActual) {
        socket.emit('salirSala', codigoSalaActual);
        codigoSalaActual = null;
        mostrarPantalla(pantallaPrincipal);
    }
});

// ... (resto del código)



socket.on('contador', (contador) => {
    contadorActivo = true;

    contadorContainer.style.display = 'block';

    contadorJuego.innerText = contador;

    if (contador <= 0) { // Cambiado a <= 0
        contadorActivo = false;
        contadorContainer.style.display = 'none';

    }

});



//fin juego





function validarNombre() {

    if (nombreUsuarioInput.value.trim() === '') {

        errorNombreSpan.style.display = 'inline';

        return false;

    } else {

        errorNombreSpan.style.display = 'none';

        return true;
    }

}



// Eventos de botones

salirSalaBtn.addEventListener('click', () => {
    if (codigoSalaActual) { // Verificar si hay un código de sala almacenado
        socket.emit('salirSala', codigoSalaActual); // Usar la variable en lugar del input
        codigoSalaActual = null;//limpiar el codigo actual
        mostrarPantalla(pantallaPrincipal);
    } else {
        console.error("No hay un código de sala almacenado."); // Manejo de error
        mostrarPantalla(pantallaPrincipal); // Redirige a la pantalla principal incluso si hay un error
    }
});



copiarCodigoBtn.addEventListener('click', () => {

    navigator.clipboard.writeText(codigoSalaEspera.textContent);

    alert("Código copiado al portapapeles");

});



crearSalaBtn.addEventListener('click', () => {
    if (validarNombre()) {
        const nombreUsuario = nombreUsuarioInput.value.trim();
        socket.emit('crear sala', nombreUsuario);
    }
});



unirseSalaBtn.addEventListener('click', () => {

    if (validarNombre()) {

        const codigoSala = codigoSalaInput.value.trim();

        const nombreUsuario = nombreUsuarioInput.value.trim();

        socket.emit('unirse a sala', { codigoSala, nombreUsuario });

    }

});



iniciarJuegoBtn.addEventListener('click', () => {
    const jugadoresAzul = document.querySelectorAll('#listaAzul li').length;
    const jugadoresRojo = document.querySelectorAll('#listaRojo li').length;
    const totalJugadores = jugadoresAzul + jugadoresRojo;

    if (jugadoresAzul > 0 && jugadoresRojo > 0 && totalJugadores >= 2) {
        const codigoSala = codigoSalaInput.value;
        socket.emit('iniciar juego', codigoSala);
        mostrarPantalla(pantallaJuego); // Al iniciar el juego, muestra la pantalla de juego
        iniciarTemporizadorRespuestas();
    } else {
        alert('Debe haber al menos 1 jugador en cada equipo y un mínimo de 2 jugadores para iniciar el juego.');
    }
});




unirmeAzulBtn.addEventListener('click', () => {

    const codigoSala = codigoSalaInput.value;

    socket.emit('asignar equipo', { codigoSala: codigoSala, equipo: 'equipoAzul' });

});



unirmeRojoBtn.addEventListener('click', () => {

    const codigoSala = codigoSalaInput.value;

    socket.emit('asignar equipo', { codigoSala: codigoSala, equipo: 'equipoRojo' });

});


botonPresionar.addEventListener('click', () => {
    if (!botonPresionado) {
        socket.emit('boton presionado', codigoSalaActual);
        botonPresionar.disabled = true;
        botonPresionar.classList.remove("boton-habilitado");
        botonPresionar.classList.add("boton-deshabilitado");
        botonPresionado = true;
    } else if (botonPresionado && botonPresionar.disabled) { // Añadido: Penalización
        socket.emit('presionar boton desactivado', codigoSalaActual);
    }
});



// Eventos de Socket.IO

socket.on('sala creada', (data) => {
    codigoSalaInput.value = data.codigoSala;
    codigoSalaEspera.textContent = data.codigoSala;
    codigoSalaActual = data.codigoSala; // Guardar el código en la variable
    mostrarPantalla(pantallaEspera);
});




socket.on('union a sala exitosa', (data) => {
    codigoSalaInput.value = data.codigoSala;
    codigoSalaEspera.textContent = data.codigoSala;
    codigoSalaActual = data.codigoSala; // Guardar el código en la variable
    mostrarPantalla(pantallaEspera);
});


socket.on('obtener jugadores', (jugadoresEnSala) => {

    listaAzul.innerHTML = '';

    listaRojo.innerHTML = '';



    for (const jugadorId in jugadoresEnSala) {

        const jugador = jugadoresEnSala[jugadorId];

        const jugadorElemento = document.createElement('li');

        jugadorElemento.textContent = jugador.nombre || `Jugador ${jugador.id}`;

        if (jugador.equipo === 'equipoAzul') {

            listaAzul.appendChild(jugadorElemento);

        } else if (jugador.equipo === 'equipoRojo') {

            listaRojo.appendChild(jugadorElemento);

        }

    }

});



socket.on('es creador', (esCreador) => {

    esperaFooter.style.display = esCreador ? 'block' : 'none';

    codigoSalaTexto.style.display = 'inline';

    esperaContainer.style.display = 'block';

});



socket.on('juego iniciado', () => {
    mostrarPantalla(pantallaJuego); // Muestra la pantalla del juego
});



socket.on('sala inexistente', () => {

    alert("La sala no existe.");

    codigoSalaInput.value = ""; // Limpiar el input

});

socket.on('sala cerrada', () => {
    alert("El creador de la sala se ha desconectado. La sala se ha cerrado.");
    mostrarPantalla(pantallaPrincipal);
    codigoSalaInput.value = "";
    codigoSalaEspera.textContent = "";
});

socket.on('error', (data) => {

    alert(data.message); // Mostrar mensaje de error al usuario

});





//juego

socket.on('pregunta', (preguntaData) => {
    preguntaContainer.innerHTML = '';
    respuestasContainer.innerHTML = '';
    botonesRespuesta = [];
    botonPresionado = false;
    botonPresionar.disabled = true; // Deshabilitar el botón principal al inicio de cada pregunta
    botonPresionar.classList.remove("boton-habilitado");//quita la clase verde
    botonPresionar.classList.add("boton-deshabilitado");//agrega la clase gris

    const preguntaElemento = document.createElement('h2');
    preguntaElemento.textContent = preguntaData.pregunta;
    preguntaContainer.appendChild(preguntaElemento);

    preguntaData.respuestas.forEach(respuesta => {
        const botonRespuesta = document.createElement('button');
        botonRespuesta.textContent = respuesta;
        botonRespuesta.disabled = true;
        botonRespuesta.classList.add("boton-deshabilitado")
        botonRespuesta.addEventListener('click', () => {
            if(!botonRespuesta.disabled){
                socket.emit('respuesta', { codigoSala: codigoSalaActual, respuesta: respuesta });
                botonesRespuesta.forEach(boton => {
                    boton.disabled = true;
                    boton.classList.add("boton-deshabilitado")
                }); // Deshabilitar todos los botones después de responder
            }
        });
        respuestasContainer.appendChild(botonRespuesta);
        botonesRespuesta.push(botonRespuesta);
    });
});


socket.on('activar boton', () => {
    botonPresionar.disabled = false;
    botonPresionar.classList.remove("boton-deshabilitado");//quita la clase gris
    botonPresionar.classList.add("boton-habilitado");//agrega la clase verde
});
socket.on('desactivar boton', () => {
    botonPresionar.disabled = true;
    botonPresionar.classList.remove("boton-habilitado");//quita la clase verde
    botonPresionar.classList.add("boton-deshabilitado");//agrega la clase gris
});

botonPresionar.addEventListener('click', () => {
    if(!botonPresionado){
      socket.emit('boton presionado', codigoSalaActual);
      botonPresionar.disabled = true;
      botonPresionado = true;
    }
});
socket.on('actualizarPuntuacion', (puntuaciones) => {
    puntuacionAzulPantalla.textContent = puntuaciones.puntuacionAzul;
    puntuacionRojoPantalla.textContent = puntuaciones.puntuacionRojo;
});

socket.on('activar respuestas', (equipo) => {
    const jugadorLocal = Object.values(jugadoresEnSala).find(jugador => jugador.id === socket.id);
    if(jugadorLocal && jugadorLocal.equipo === equipo){
      botonesRespuesta.forEach(boton => {
          boton.disabled = false;
          boton.classList.remove("boton-deshabilitado")
      });
    }
});
socket.on('juego terminado', (ganador) => {
    if (ganador) {
      alert(`¡El equipo ${ganador} ha ganado!`);
    } else {
      alert("¡Juego terminado en empate!");
    }
    mostrarPantalla(pantallaPrincipal);
});

socket.on('desactivar respuestas', () => {
    botonesRespuesta.forEach(boton => {
        boton.disabled = true;
        boton.classList.add("boton-deshabilitado")
    }); // Deshabilitar todos los botones después de responder
});

respuestasContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && !contadorActivo) { //Verifica que no este activo el contador
        if(!event.target.disabled){
            socket.emit('respuesta', { codigoSala: codigoSalaActual, respuesta: event.target.textContent });
            botonesRespuesta.forEach(boton => {
                boton.disabled = true;
                boton.classList.add("boton-deshabilitado")
            }); // Deshabilitar todos los botones después de responder
        }
    }
});

