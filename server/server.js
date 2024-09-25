// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Inicializa o app Express e o servidor HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};  // Armazena os jogadores conectados

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Quando um jogador se conecta
io.on('connection', (socket) => {
    console.log(`Novo jogador conectado: ${socket.id}`);

    // Adiciona o jogador ao objeto players
    if (Object.keys(players).length < 2) {
        players[socket.id] = { score: 0, position: 0 };  // Posiciona o jogador
        socket.emit('playerData', { playerId: socket.id });
        io.emit('playersUpdate', players);
    } else {
        socket.emit('roomFull');  // Informa se já houverem 2 jogadores
    }

    // Recebe a movimentação do jogador
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].position = data.position;
            io.emit('playersUpdate', players);  // Envia a posição para todos os jogadores
        }
    });

    // Quando o jogador se desconecta
    socket.on('disconnect', () => {
        console.log(`Jogador desconectado: ${socket.id}`);
        delete players[socket.id];
        io.emit('playersUpdate', players);  // Atualiza os outros jogadores
    });
});

// Define a porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
