const express = require('express');
const app = express(); // Definición de app
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer(app); // Uso de app después de su definición
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const salas = {};

// Servir archivos estáticos desde la carpeta 'cliente'
app.use(express.static('cliente'));

// Cuando alguien accede a la ruta principal, servimos el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cliente/index.html');
});

const preguntas = {
    ciencia: [
        { pregunta: "¿Cuál es el elemento más abundante en el universo?", respuestas: ["Hidrógeno", "Oxígeno", "Nitrógeno", "Carbono"], correcta: "Hidrógeno" },
        { pregunta: "¿Cuántos huesos tiene el cuerpo humano adulto?", respuestas: ["206", "213", "210", "200"], correcta: "206" },
        { pregunta: "¿Cuál es el planeta más grande del sistema solar?", respuestas: ["Júpiter", "Saturno", "Tierra", "Neptuno"], correcta: "Júpiter" },
        { pregunta: "¿Qué tipo de sangre es conocido como donante universal?", respuestas: ["O negativo", "A positivo", "B negativo", "AB positivo"], correcta: "O negativo" },
        { pregunta: "¿Cuál es la molécula que almacena la información genética?", respuestas: ["ADN", "ARN", "Proteína", "Glucosa"], correcta: "ADN" },
        { pregunta: "¿Qué científico formuló la teoría de la relatividad?", respuestas: ["Albert Einstein", "Isaac Newton", "Stephen Hawking", "Galileo Galilei"], correcta: "Albert Einstein" },
        { pregunta: "¿Cuál es la unidad básica de la vida?", respuestas: ["Célula", "Átomo", "Molécula", "Tejido"], correcta: "Célula" },
        { pregunta: "¿Qué gas necesitan las plantas para la fotosíntesis?", respuestas: ["Dióxido de carbono", "Oxígeno", "Nitrógeno", "Helio"], correcta: "Dióxido de carbono" },
        { pregunta: "¿Cuántos planetas hay en el sistema solar?", respuestas: ["8", "9", "7", "10"], correcta: "8" },
        { pregunta: "¿Qué órgano es responsable de bombear la sangre?", respuestas: ["Corazón", "Pulmones", "Riñón", "Estómago"], correcta: "Corazón" },
        { pregunta: "¿Qué metal es líquido a temperatura ambiente?", respuestas: ["Mercurio", "Hierro", "Oro", "Plata"], correcta: "Mercurio" },
        { pregunta: "¿Qué animal tiene el cerebro más grande en relación con su cuerpo?", respuestas: ["Delfín", "Elefante", "Perro", "Ser humano"], correcta: "Delfín" },
        { pregunta: "¿Cuál es el símbolo químico del agua?", respuestas: ["H2O", "CO2", "O2", "NaCl"], correcta: "H2O" },
        { pregunta: "¿Cuál es el metal más ligero?", respuestas: ["Litio", "Aluminio", "Plomo", "Hierro"], correcta: "Litio" },
        { pregunta: "¿Cuál es el hueso más largo del cuerpo humano?", respuestas: ["Fémur", "Tibia", "Húmero", "Radio"], correcta: "Fémur" },
        { pregunta: "¿Cuál es la velocidad de la luz?", respuestas: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "500,000 km/s"], correcta: "300,000 km/s" },
        { pregunta: "¿Qué planeta es conocido como el planeta rojo?", respuestas: ["Marte", "Venus", "Mercurio", "Júpiter"], correcta: "Marte" },
        { pregunta: "¿Qué fuerza nos mantiene en la Tierra?", respuestas: ["Gravedad", "Magnetismo", "Energía cinética", "Presión atmosférica"], correcta: "Gravedad" },
        { pregunta: "¿Quién descubrió la penicilina?", respuestas: ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Isaac Newton"], correcta: "Alexander Fleming" },
        { pregunta: "¿Qué gas es vital para la respiración humana?", respuestas: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Hidrógeno"], correcta: "Oxígeno" },
        { pregunta: "¿Cuál es el planeta más cercano al sol?", respuestas: ["Mercurio", "Venus", "Tierra", "Marte"], correcta: "Mercurio" },
        { pregunta: "¿Qué instrumento mide la temperatura?", respuestas: ["Termómetro", "Barómetro", "Microscopio", "Telescopio"], correcta: "Termómetro" },
        { pregunta: "¿Qué parte del cuerpo produce insulina?", respuestas: ["Páncreas", "Hígado", "Riñón", "Estómago"], correcta: "Páncreas" },
        { pregunta: "¿Qué planeta tiene anillos?", respuestas: ["Saturno", "Marte", "Júpiter", "Venus"], correcta: "Saturno" },
        { pregunta: "¿Cuál es el órgano más grande del cuerpo humano?", respuestas: ["Piel", "Hígado", "Pulmones", "Corazón"], correcta: "Piel" },
        { pregunta: "¿Qué animal puede regenerar partes de su cuerpo?", respuestas: ["Estrella de mar", "León", "Elefante", "Lobo"], correcta: "Estrella de mar" },
        { pregunta: "¿Qué científico formuló la ley de gravedad?", respuestas: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"], correcta: "Isaac Newton" },
        { pregunta: "¿Qué estructura del ojo nos permite ver colores?", respuestas: ["Conos", "Bastones", "Córnea", "Cristalino"], correcta: "Conos" }
    ],
    historia: [
        { pregunta: "¿En qué año comenzó la Segunda Guerra Mundial?", respuestas: ["1939", "1945", "1914", "1929"], correcta: "1939" },
        { pregunta: "¿Quién fue el primer presidente de los Estados Unidos?", respuestas: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"], correcta: "George Washington" },
        { pregunta: "¿En qué año cayó el Muro de Berlín?", respuestas: ["1989", "1975", "1991", "1985"], correcta: "1989" },
        { pregunta: "¿Quién descubrió América?", respuestas: ["Cristóbal Colón", "Américo Vespucio", "Fernando de Magallanes", "James Cook"], correcta: "Cristóbal Colón" },
        { pregunta: "¿Cuál fue la civilización que construyó las pirámides de Egipto?", respuestas: ["Egipcia", "Maya", "Inca", "Griega"], correcta: "Egipcia" },
        { pregunta: "¿Qué guerra se libró entre 1936 y 1939 en España?", respuestas: ["Guerra Civil Española", "Guerra de Sucesión", "Revolución Industrial", "Guerra de la Independencia"], correcta: "Guerra Civil Española" },
        { pregunta: "¿Quién fue el líder de la Revolución Cubana?", respuestas: ["Fidel Castro", "Che Guevara", "Simón Bolívar", "Hugo Chávez"], correcta: "Fidel Castro" },
        { pregunta: "¿Qué emperador romano fue asesinado en el Senado en el 44 a.C.?", respuestas: ["Julio César", "Nerón", "Augusto", "Tiberio"], correcta: "Julio César" },
        { pregunta: "¿En qué año llegó el hombre a la Luna?", respuestas: ["1969", "1975", "1965", "1970"], correcta: "1969" },
        { pregunta: "¿Qué tratado puso fin a la Primera Guerra Mundial?", respuestas: ["Tratado de Versalles", "Tratado de París", "Tratado de Utrecht", "Tratado de Lisboa"], correcta: "Tratado de Versalles" },
        { pregunta: "¿Qué civilización antigua construyó Machu Picchu?", respuestas: ["Inca", "Azteca", "Maya", "Olmeca"], correcta: "Inca" },
        { pregunta: "¿Quién fue conocido como el Libertador de América?", respuestas: ["Simón Bolívar", "San Martín", "Hernán Cortés", "Francisco Pizarro"], correcta: "Simón Bolívar" },
        { pregunta: "¿En qué año comenzó la Revolución Francesa?", respuestas: ["1789", "1776", "1804", "1812"], correcta: "1789" },
        { pregunta: "¿Qué civilización desarrolló la escritura cuneiforme?", respuestas: ["Sumeria", "Egipcia", "Fenicia", "Griega"], correcta: "Sumeria" },
        { pregunta: "¿Qué líder militar conquistó gran parte de Europa en el siglo XIX?", respuestas: ["Napoleón Bonaparte", "Alejandro Magno", "César Augusto", "Carlos Magno"], correcta: "Napoleón Bonaparte" },
        { pregunta: "¿Qué país fue conocido como la 'URSS'?", respuestas: ["Unión Soviética", "Alemania", "China", "Estados Unidos"], correcta: "Unión Soviética" },
        { pregunta: "¿Quién pintó la Capilla Sixtina?", respuestas: ["Miguel Ángel", "Leonardo da Vinci", "Rafael", "Donatello"], correcta: "Miguel Ángel" },
        { pregunta: "¿Qué barco se hundió en 1912 y es conocido mundialmente?", respuestas: ["Titanic", "Lusitania", "Endeavour", "Santa María"], correcta: "Titanic" },
        { pregunta: "¿Quién fue el último zar de Rusia?", respuestas: ["Nicolás II", "Pedro el Grande", "Iván el Terrible", "Alejandro II"], correcta: "Nicolás II" },
        { pregunta: "¿Qué imperio fue gobernado por Alejandro Magno?", respuestas: ["Macedonio", "Romano", "Persa", "Egipcio"], correcta: "Macedonio" },
        { pregunta: "¿Qué país colonizó gran parte de América Latina?", respuestas: ["España", "Francia", "Portugal", "Inglaterra"], correcta: "España" }
    ],
    deportes: [
        { pregunta: "¿Cuántos anillos olímpicos hay?", respuestas: ["5", "4", "6", "7"], correcta: "5" },
        { pregunta: "¿Qué país ganó la Copa Mundial de la FIFA 2018?", respuestas: ["Francia", "Croacia", "Brasil", "Alemania"], correcta: "Francia" },
        { pregunta: "¿En qué deporte se usa la raqueta más grande?", respuestas: ["Tenis", "Bádminton", "Squash", "Ping Pong"], correcta: "Tenis" },
        { pregunta: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?", respuestas: ["11", "10", "12", "9"], correcta: "11" },
        { pregunta: "¿Cuál es el deporte más practicado en el mundo?", respuestas: ["Fútbol", "Baloncesto", "Béisbol", "Críquet"], correcta: "Fútbol" },
        { pregunta: "¿Quién tiene el récord de más medallas olímpicas ganadas?", respuestas: ["Michael Phelps", "Usain Bolt", "Simone Biles", "Carl Lewis"], correcta: "Michael Phelps" },
        { pregunta: "¿En qué país se originó el rugby?", respuestas: ["Inglaterra", "Francia", "Nueva Zelanda", "Australia"], correcta: "Inglaterra" },
        { pregunta: "¿Cuánto dura un partido de baloncesto en la NBA?", respuestas: ["48 minutos", "40 minutos", "60 minutos", "90 minutos"], correcta: "48 minutos" },
        { pregunta: "¿Qué atleta es conocido como 'El Relámpago'?", respuestas: ["Usain Bolt", "Carl Lewis", "Mo Farah", "Jesse Owens"], correcta: "Usain Bolt" },
        { pregunta: "¿Qué trofeo se entrega al campeón de la NFL?", respuestas: ["Trofeo Vince Lombardi", "Trofeo Stanley Cup", "Trofeo Larry O'Brien", "Trofeo FIFA"], correcta: "Trofeo Vince Lombardi" }
    ],
    entretenimiento: [
        { pregunta: "¿Quién dirigió la película 'Titanic'?", respuestas: ["James Cameron", "Steven Spielberg", "Christopher Nolan", "Quentin Tarantino"], correcta: "James Cameron" },
        // ... más preguntas de entretenimiento
    ],
    geografia: [
        { pregunta: "¿Cuál es el río más largo del mundo?", respuestas: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], correcta: "Nilo" },
        // ... más preguntas de geografía
    ],
    videojuegos: [
        { pregunta: "¿Cuál es el personaje principal de la saga The Legend of Zelda?", respuestas: ["Link", "Zelda", "Ganon", "Epona"], correcta: "Link" },
        { pregunta: "¿En qué juego aparece el personaje 'Master Chief'?", respuestas: ["Halo", "Gears of War", "Call of Duty", "Destiny"], correcta: "Halo" },
        { pregunta: "¿Qué empresa desarrolló el juego 'Fortnite'?", respuestas: ["Epic Games", "Blizzard", "Ubisoft", "Valve"], correcta: "Epic Games" },
        { pregunta: "¿En qué juego luchas contra criaturas llamadas 'Creepers'?", respuestas: ["Minecraft", "Terraria", "Roblox", "Rust"], correcta: "Minecraft" },
        { pregunta: "¿Cuál es el primer videojuego de la historia?", respuestas: ["Pong", "Pac-Man", "Tetris", "Space Invaders"], correcta: "Pong" },
        { pregunta: "¿En qué año se lanzó el primer juego de 'Super Mario Bros'?", respuestas: ["1985", "1990", "1980", "1978"], correcta: "1985" },
        { pregunta: "¿Qué videojuego tiene el lema 'The cake is a lie'?", respuestas: ["Portal", "Half-Life", "Bioshock", "DOOM"], correcta: "Portal" },
        { pregunta: "¿Qué empresa desarrolló el juego 'The Witcher 3'?", respuestas: ["CD Projekt Red", "Bethesda", "Rockstar Games", "Bioware"], correcta: "CD Projekt Red" },
        { pregunta: "¿Qué personaje es conocido por su frase 'It's-a me, Mario!'?", respuestas: ["Mario", "Luigi", "Wario", "Donkey Kong"], correcta: "Mario" },
        { pregunta: "¿En qué juego aparece el personaje 'Geralt de Rivia'?", respuestas: ["The Witcher", "Skyrim", "Dragon Age", "Dark Souls"], correcta: "The Witcher" },
        { pregunta: "¿Cuál es el nombre del villano principal de la saga 'Final Fantasy VII'?", respuestas: ["Sephiroth", "Cloud", "Zidane", "Tifa"], correcta: "Sephiroth" },
        { pregunta: "¿Qué juego popular de batallas reales se lanzó en 2017?", respuestas: ["Fortnite", "PUBG", "Apex Legends", "Warzone"], correcta: "Fortnite" },
        { pregunta: "¿Cuál es el nombre de la princesa en la saga 'Super Mario'?", respuestas: ["Peach", "Daisy", "Zelda", "Pauline"], correcta: "Peach" },
        { pregunta: "¿Qué videojuego tiene como escenario principal la ciudad de Los Santos?", respuestas: ["GTA V", "Watch Dogs", "Mafia", "L.A. Noire"], correcta: "GTA V" },
        { pregunta: "¿Qué juego de rol tiene como protagonista a un cazador de dragones llamado Dovahkiin?", respuestas: ["Skyrim", "Dark Souls", "The Witcher", "Elden Ring"], correcta: "Skyrim" },
        { pregunta: "¿Qué saga de videojuegos tiene un modo llamado 'Zombis'?", respuestas: ["Call of Duty", "Battlefield", "Gears of War", "Left 4 Dead"], correcta: "Call of Duty" },
        { pregunta: "¿Cuál es el nombre del fontanero que debe rescatar a la princesa Peach?", respuestas: ["Mario", "Luigi", "Toad", "Bowser"], correcta: "Mario" },
        { pregunta: "¿En qué juego exploras la región de Kanto y capturas criaturas llamadas 'Pokémon'?", respuestas: ["Pokémon Rojo/Azul", "Digimon", "Yu-Gi-Oh!", "Monster Hunter"], correcta: "Pokémon Rojo/Azul" },
        { pregunta: "¿Qué juego incluye un modo llamado 'Battle Royale' y es famoso por sus bailes?", respuestas: ["Fortnite", "Free Fire", "PUBG", "Apex Legends"], correcta: "Fortnite" },
        { pregunta: "¿Qué juego de sigilo tiene como protagonista a 'Solid Snake'?", respuestas: ["Metal Gear Solid", "Splinter Cell", "Hitman", "Thief"], correcta: "Metal Gear Solid" },
        { pregunta: "¿Cuál es el arma principal de Gordon Freeman en Half-Life?", respuestas: ["Piedra", "Pistola de gravedad", "Bate", "Espada"], correcta: "Pistola de gravedad" },
        { pregunta: "¿Qué tipo de criatura es 'Pikachu'?", respuestas: ["Ratón eléctrico", "Dragón", "Perro de fuego", "Planta"], correcta: "Ratón eléctrico" },
        { pregunta: "¿Qué juego se desarrolla en Rapture, una ciudad submarina?", respuestas: ["Bioshock", "Subnautica", "Sea of Thieves", "Aquanox"], correcta: "Bioshock" },
        { pregunta: "¿Qué empresa creó la saga 'Assassin's Creed'?", respuestas: ["Ubisoft", "Activision", "Rockstar", "Square Enix"], correcta: "Ubisoft" }
    ],
};

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
                const categorias = Object.keys(preguntas);
                const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
                const preguntasDeCategoria = preguntas[categoriaAleatoria];
                const preguntaAleatoria = preguntasDeCategoria[Math.floor(Math.random() * preguntasDeCategoria.length)];
                salas[codigoSala].preguntaActual = preguntaAleatoria;
    
                io.to(codigoSala).emit('pregunta', { pregunta: preguntaAleatoria.pregunta, respuestas: preguntaAleatoria.respuestas });
    
                const tiempoActivacion = Math.floor(Math.random() * 9001) + 1000; // Corrección: entre 1000 y 10000 ms (1-10 segundos)
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
                const preguntaActual = salas[codigoSala].preguntaActual;
                const esCorrecta = preguntaActual.correcta === respuesta;
    
                if (esCorrecta) {
                    if (salas[codigoSala].jugadores[socket.id].equipo === "equipoAzul") {
                        salas[codigoSala].puntuacionAzul += 100;
                    } else if (salas[codigoSala].jugadores[socket.id].equipo === "equipoRojo") {
                        salas[codigoSala].puntuacionRojo += 100;
                    }
                } else {
                    if (salas[codigoSala].jugadores[socket.id].equipo === "equipoAzul") {
                        salas[codigoSala].puntuacionAzul -= 100;
                    } else if (salas[codigoSala].jugadores[socket.id].equipo === "equipoRojo") {
                        salas[codigoSala].puntuacionRojo -= 100;
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



