const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const salas = {};

const nombresDeJuegos = {
    1: "Mass Effect 3",
    2: "The Legend of Zelda: Ocarina of Time",
    3: "Outer Wilds",
    4: "Horizon Zero Dawn",
    5: "The Secret of Monkey Island",
    6: "Grand Theft Auto 3",
    7: "Resident Evil 4",
    8: "Portal 2",
    9: "Shadow of the Colossus",
    10: "Mario Golf",
    11: "Call of Duty: Modern Warfare 2",
    12: "The Witness",
    13: "Halo: Combat Evolved",
    14: "Bloodborne",
    15: "Forza Horizon 5",
    16: "Super Meat Boy",
    17: "The Elder Scrolls IV: Oblivion",
    18: "BioShock Infinite",
    19: "Chrono Trigger",
    20: "Furi",
    21: "Yakuza 0",
    22: "Dead Cells",
    23: "Persona 5",
    24: "NieR:Automata",
    25: "Super Mario 64",
    26: "The Last of Us",
    27: "Left 4 Dead",
    28: "SimCopter",
    29: "Diablo",
    30: "Dark Souls",
    31: "Ghostwire: Tokyo",
    32: "Night In The Woods",
    33: "The Legend of Zelda: Breath of the Wild",
    34: "Fable: The Lost Chapter",
    35: "Dota 2",
    36: "World of Warcraft",
    37: "Dead Space",
    38: "Sea of Thieves",
    39: "Monster Hunter: World",
    40: "Hollow Knight",
    41: "Destiny 2",
    42: "Animal Crossing: New Horizons",
    43: "The Witcher 3: Wild Hunt",
    44: "GRIS",
    45: "Returnal",
    46: "Super Mario RPG: Legend of the Seven Stars",
    47: "Code Vein",
    48: "Deep Rock Galactic",
    49: "Apex Legends",
    50: "Nidhogg",
    51: "Sid Meier's Civilization VI",
    52: "Katamari Damacy",
    53: "Overwatch",
    54: "Inside",
    55: "Batman: Arkham Asylum",
    56: "Dragon Age: Inquisition",
    57: "DIRT 4",
    58: "Spore",
    59: "Burnout 3: Takedown",
    60: "The Sims",
    61: "Star Wars: Knights of the Old Republic",
    62: "Super Smash Bros. Ultimate",
    63: "Goldeneye 007",
    64: "Hotline Miami",
    65: "Rock Band",
    66: "Tony Hawk's Pro Skater",
    67: "Super Mario Galaxy",
    68: "Return of the Obra Dinn",
    69: "Fortnite",
    70: "God of War",
    71: "The Elder Scrolls V: Skyrim",
    72: "PUBG: Battlegrounds",
    73: "Wii Sports",
    74: "Shovel Knight",
    75: "XCOM: Enemy Unknown",
    76: "Celeste",
    77: "Divinity: Original Sin II",
    78: "Gone Home",
    79: "Fallout: New Vegas",
    80: "The Legend of Zelda: The Wind Waker",
    81: "Kerbal Space Program",
    82: "Braid",
    83: "Dead Rising",
    84: "Stardew Valley",
    85: "Control",
    86: "Minecraft",
    87: "Counter-Strike: Global Offensive",
    88: "Glover",
    89: "Jak and Daxter: The Precursor Legacy",
    90: "Papers, Please",
    91: "Pokemon Go",
    92: "Metroid Prime",
    93: "FTL: Faster Than Light",
    94: "Diablo II",
    95: "aper Mario: The Thousand-Year Door",
    96: "Transistor",
    97: "Marvel's Spider-Man: Miles Morales",
    98: "Final Fantasy VIII",
    99: "Street Fighter II: The World Warrior",
    100: "Hunt: Showdown",
    101: "Dead by Daylight",
    102: "Uncharted: Drake's Fortune",
    103: "Far Cry 3",
    104: "Dishonored",
    105: "Metal Gear Rising: Revengeance",
    106: "Risk of Rain 2",
    107: "Rollercoaster Tycoon",
    108: "Death Stranding",
    109: "Kingdom Hearts II",
    110: "Devil May Cry 5",
    111: "Spyro the Dragon",
    112: "Okami",
    113: "Bomberman Hero",
    114: "LittleBigPlanet",
    115: "Final Fantasy XIV Online: A Realm Reborn",
    116: "Quake",
    117: "The Talos Principle",
    118: "The Stanley Parable",
    119: "Fez",
    120: "Amnesia: The Dark Descent",
    121: "Professor Layton and the Curious Village",
    122: "Half-Life 2",
    123: "Assassin's Creed II",
    124: "The Simpsons: Hit & Run",
    125: "Payday 2",
    126: "Metal Gear Solid 2: Sons of Liberty",
    127: "Disco Elysium",
    128: "Red Dead Redemption",
    129: "Rocket League",
    130: "ARK: Survival Evolved",
    131: "Genshin Impact",
    132: "Counter-Strike",
    133: "Mario Kart: Double Dash!!",
    134: "Undertale",
    135: "Cities: Skylines",
    136: "Rust",
    137: "Viva Piñata",
    138: "Overcooked!",
    139: "Team Fortress 2",
    140: "Hitman 3",
    141: "Doom Eternal",
    142: "Hades",
    143: "Tunic",
    144: "Ratchet & Clank",
    145: "Elden Ring",
    146: "No Man's Sky",
    147: "Crazy Taxi",
    148: "Crysis",
    149: "VVVVVV",
    150: "Starcraft",
   

};

const preguntas = [];

function generarPregunta() {
    const juegoId = Math.floor(Math.random() * Object.keys(nombresDeJuegos).length) + 1; // Número de juego entre 1 y la cantidad de juegos que tengas en el objeto
    const imagenId = Math.floor(Math.random() * 2) + 1;
    const imagenURL = `https://guessthe.game/games/${juegoId}/${imagenId}.webp`;

    const opciones = [];
    opciones.push(nombresDeJuegos[juegoId]); // Añadir la respuesta correcta

    // Añadir 3 respuestas incorrectas únicas
    while (opciones.length < 4) {
        const indicesIncorrectos = Object.keys(nombresDeJuegos).filter(indice => !opciones.includes(nombresDeJuegos[indice]));
        const indiceAleatorioIncorrecto = indicesIncorrectos[Math.floor(Math.random() * indicesIncorrectos.length)];
        const opcionIncorrecta = nombresDeJuegos[indiceAleatorioIncorrecto];
        if (!opciones.includes(opcionIncorrecta)) { // Verificar que no se repitan las opciones
            opciones.push(opcionIncorrecta);
        }
    }
    //Desordena las opciones para que la correcta no siempre este en la misma posicion
    opciones.sort(() => Math.random() - 0.5);

    return {
        imagen: imagenURL,
        opciones: opciones,
        correcta: nombresDeJuegos[juegoId]
    };
}

for (let i = 0; i < 50; i++) {
    preguntas.push(generarPregunta());
}


app.use(express.static(path.join(__dirname, 'cliente')));

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('crear sala', (nombreUsuario) => {
        const codigoSala = uuidv4().slice(0, 8);
        salas[codigoSala] = {
            jugadores: {},
            equipoAzul: [],
            equipoRojo: [],
            puntuacionAzul: 0,
            puntuacionRojo: 0,
            jugando: false,
            creador: socket.id,
            preguntaActual: null,
            equipoRespondio: null, // Nuevo: indica qué equipo ya respondió
            jugadorQuePresiono: null
        };
        socket.join(codigoSala);
        salas[codigoSala].jugadores[socket.id] = { equipo: null, id: socket.id, nombre: nombreUsuario };

        socket.emit('sala creada', { codigoSala });
        socket.emit('es creador', true);

        io.to(codigoSala).emit('obtener jugadores', salas[codigoSala].jugadores);

        console.log(`Sala creada: ${codigoSala} por ${nombreUsuario}`);
    });

    socket.on('unirse a sala', (data) => {
        const { codigoSala, nombreUsuario } = data;
        if (salas[codigoSala]) {
            socket.join(codigoSala);
            salas[codigoSala].jugadores[socket.id] = { equipo: null, id: socket.id, nombre: nombreUsuario };
            socket.emit('union a sala exitosa', { codigoSala });

            if (salas[codigoSala].creador === socket.id) {
                socket.emit('es creador', true);
            } else {
                socket.emit('es creador', false);
            }
            io.to(codigoSala).emit('obtener jugadores', salas[codigoSala].jugadores);

            console.log(`Usuario ${nombreUsuario} se unió a la sala ${codigoSala}`);
        } else {
            socket.emit('sala inexistente');
        }
    });

    socket.on('asignar equipo', (data) => {
        const { codigoSala, equipo } = data;
        if (salas[codigoSala]) {
            for (const team in ['equipoAzul', 'equipoRojo']) {
                if (salas[codigoSala][team]) {
                    salas[codigoSala][team] = salas[codigoSala][team].filter(id => id !== socket.id);
                }
            }

            if (!salas[codigoSala][equipo]) {
                salas[codigoSala][equipo] = [];
            }
            if (!salas[codigoSala][equipo].includes(socket.id)) {
                salas[codigoSala][equipo].push(socket.id);
            }

            salas[codigoSala].jugadores[socket.id].equipo = equipo;
            io.to(codigoSala).emit('obtener jugadores', salas[codigoSala].jugadores);
            io.to(codigoSala).emit('equipo asignado', salas[codigoSala]);
            console.log(salas[codigoSala]);
        } else {
            socket.emit('error', { message: 'Sala no encontrada' });
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
        const salasParaEliminar = [];
        for (const codigoSala in salas) {
            if (salas[codigoSala].jugadores[socket.id]) {
                for (const team in ['equipoAzul', 'equipoRojo']) {
                    if (salas[codigoSala] && salas[codigoSala][team]) {
                        salas[codigoSala][team] = salas[codigoSala][team].filter(id => id !== socket.id);
                    }
                }
                delete salas[codigoSala].jugadores[socket.id];
                io.to(codigoSala).emit('obtener jugadores', salas[codigoSala].jugadores);
                io.to(codigoSala).emit('jugador desconectado', socket.id);

                if (salas[codigoSala] && (Object.keys(salas[codigoSala].jugadores).length === 0 || salas[codigoSala].creador === socket.id)) {
                    salasParaEliminar.push(codigoSala);
                    io.to(codigoSala).emit('sala cerrada');
                }
                break;
            }
        }

        salasParaEliminar.forEach(codigoSala => {
            delete salas[codigoSala];
            console.log(`Sala ${codigoSala} ELIMINADA.`);
        });
    });

    socket.on('salirSala', (codigoSala) => {
        console.log(`Usuario ${socket.id} solicita salir de la sala ${codigoSala}`);
        if (salas[codigoSala] && salas[codigoSala].jugadores[socket.id]) {
            for (const team in ['equipoAzul', 'equipoRojo']) {
                if (salas[codigoSala][team]) {
                    salas[codigoSala][team] = salas[codigoSala][team].filter(id => id !== socket.id);
                }
            }
            delete salas[codigoSala].jugadores[socket.id];
            io.to(codigoSala).emit('obtener jugadores', salas[codigoSala].jugadores);
            socket.leave(codigoSala);
            console.log(`Usuario ${socket.id} salio de la sala ${codigoSala}`);

            if (Object.keys(salas[codigoSala].jugadores).length === 0 || salas[codigoSala].creador === socket.id) {
                console.log(`Sala ${codigoSala} eliminada por que no quedan jugadores o el creador salio.`);
                io.to(codigoSala).emit('sala cerrada');
                delete salas[codigoSala];
            }
        } else {
            socket.emit('error', { message: 'Sala no encontrada o jugador no en la sala' });
        }
    });

    let rondaActual = 0;
    const totalRondas = 10;

    socket.on('iniciar juego', (codigoSala) => {
        if (salas[codigoSala] && !salas[codigoSala].jugando) {
            salas[codigoSala].jugando = true;
            rondaActual = 0;
            io.to(codigoSala).emit('juego iniciado');
            iniciarContador(codigoSala);
        }
    });
    function iniciarContador(codigoSala) {
        salas[codigoSala].equipoRespondio = null;//Resetea que equipo respondio
        salas[codigoSala].jugadorQuePresiono = undefined; //Resetea el jugador que presiono el boton
        let contador = 3;
        const intervaloContador = setInterval(() => {
            io.to(codigoSala).emit('contador', contador);
            contador--;
            if (contador < 0) {
                clearInterval(intervaloContador);
                iniciarRonda(codigoSala);
            }
        }, 1000);
    }

    function iniciarRonda(codigoSala) {
        if (salas[codigoSala] && salas[codigoSala].jugando) {
            if (rondaActual < totalRondas) {
                const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
                salas[codigoSala].preguntaActual = preguntaAleatoria.correcta; // Guardamos la respuesta CORRECTA (nombre del juego)

                io.to(codigoSala).emit('pregunta', {
                    imagen: preguntaAleatoria.imagen,
                    opciones: preguntaAleatoria.opciones
                });

                const tiempoActivacion = Math.floor(Math.random() * 9001) + 1000;
                setTimeout(() => {
                    if (salas[codigoSala] && salas[codigoSala].jugando) {
                        io.to(codigoSala).emit('activar boton');
                    }
                }, tiempoActivacion);
                rondaActual++;
            } else {
                determinarGanador(codigoSala);
            }
        }
    }

    socket.on('boton presionado', (codigoSala) => {
        if (salas[codigoSala]) {
            const jugadorQuePresiono = salas[codigoSala].jugadores[socket.id];
            if (jugadorQuePresiono) {
                io.to(codigoSala).emit('activar respuestas', jugadorQuePresiono.equipo);
                io.to(codigoSala).emit('desactivar boton');
            }
        }
    });

    socket.on('respuesta', (data) => {
        const { codigoSala, respuesta } = data;
        if (salas[codigoSala] && salas[codigoSala].preguntaActual && salas[codigoSala].jugando) {
            if (salas[codigoSala].equipoRespondio === null || salas[codigoSala].jugadores[socket.id].equipo !== salas[codigoSala].equipoRespondio) {
                const esCorrecta = salas[codigoSala].preguntaActual === respuesta; // Comparamos directamente con el nombre del juego
                if (esCorrecta) {
                    if (salas[codigoSala].jugadores[socket.id].equipo === "equipoAzul") {
                        salas[codigoSala].puntuacionAzul += 100;
                    } else if (salas[codigoSala].jugadores[socket.id].equipo === "equipoRojo") {
                        salas[codigoSala].puntuacionRojo += 100;
                    }
                } else {
                    if (salas[codigoSala].jugadores[socket.id].equipo === "equipoAzul") {
                        salas[codigoSala].puntuacionAzul -= 50; //Penalizacion por respuesta incorrecta
                    } else if (salas[codigoSala].jugadores[socket.id].equipo === "equipoRojo") {
                        salas[codigoSala].puntuacionRojo -= 50; //Penalizacion por respuesta incorrecta
                    }
                }
                salas[codigoSala].equipoRespondio = salas[codigoSala].jugadores[socket.id].equipo;
                io.to(codigoSala).emit('actualizarPuntuacion', { puntuacionAzul: salas[codigoSala].puntuacionAzul, puntuacionRojo: salas[codigoSala].puntuacionRojo });
                io.to(codigoSala).emit('desactivar respuestas');
                if (salas[codigoSala].puntuacionAzul >= 1000 || salas[codigoSala].puntuacionRojo >= 1000) {
                    determinarGanador(codigoSala);
                } else {
                    setTimeout(() => {
                        iniciarContador(codigoSala);
                    }, 3000);
                }
            }
        }
    });


    function determinarGanador(codigoSala) {
        let ganador = null;
        if (salas[codigoSala]) {
            if (salas[codigoSala].puntuacionAzul > salas[codigoSala].puntuacionRojo) {
                ganador = "Azul";
            } else if (salas[codigoSala].puntuacionRojo > salas[codigoSala].puntuacionAzul) {
                ganador = "Rojo";
            }
            io.to(codigoSala).emit('juego terminado', ganador);
            salas[codigoSala].jugando = false; // Importante: Marcar el juego como no activo
        }
    }
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});



