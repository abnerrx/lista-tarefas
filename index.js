const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Meu servidor tá no ar!');
});

app.get('/ola/:nome', (req, res) => {
    let nome = req.params.nome;
    res.send(`Olá, ${nome}!`);
});

app.use(express.json());

let usuarios = [];

app.post('/usuarios',(req, res) =>{
    let novoUsuario = req.body;
    usuarios.push(novoUsuario);
    res.send(`Usuário ${novoUsuario.nome} adicionado!`);
});

app.get('/usuarios', (req, res) => {
    res.send(usuarios);
})


app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

