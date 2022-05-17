const express = require('express');

const app = express();

app.use(express.static('public'));

const http = require('http').Server(app);
const serverSocket = require('socket.io')(http); //recupero a lib do socket e ja chama uma funcao, passando http


http.listen(4000, () => {
    console.log('Servidor rodando');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); //toda vez que chamar a rota raiz, irá renderizar esse arquivo html
});

serverSocket.on('connection', (socket) => {  //criando uma escuta de conexao

    socket.on('login', (nickName) => {  //criando uma escuta e login
        console.log('Cliente conectado: ' + nickName);
        serverSocket.emit('chatMessage', `Usuário ${nickName} conectou!`);
        socket.nickName = nickName;
    });

    socket.on('chatMessage', (message) => {
        serverSocket.emit('chatMessage', `${socket.nickName}: ${message}`);
    });


    // serverSocket.emit => manda para todos, inclusive o proprio user
    // socket.broadcast.emit => manda para todos, EXCETO para o proprio user 

    socket.on('status', (status) => {
        socket.broadcast.emit('status', status);
    });
});
