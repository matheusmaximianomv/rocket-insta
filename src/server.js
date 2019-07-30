/* Importação de Bibliotecas */
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const http = require('http');

/* Instância de Bibliotecas */
const app = express();

/* Configurando o protocolo de socket */
const server = http.Server(app);
const io = require('socket.io')(server);

/* Conexão com Banco de dados */
mongoose.connect('mongodb+srv://admin:admin@cluster0-jtqis.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useCreateIndex : true
});

/* Middleware de configuração do socket.io */
app.use((req, res, next) => {
    req.io = io;
    return next();
});

/* Configuração de Acesso a API */
app.use(cors());

/* Configuração de Recebimento de Dados */
app.use(express.urlencoded({
    extended : true
}))

/* Configurando rotas de acesso as imagens */
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

/* Configuração de Rotas */
app.use(require('./routes'));

const PORT = process.env.PORT || 3001;
const URL = process.env.URL || 'http://www.localhost';
server.listen(PORT, () => {
    console.log(`Server Running In ${URL}:${PORT}`);
});
