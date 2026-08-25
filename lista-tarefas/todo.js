const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let tarefas = [];

app.post('/tarefas', (req, res) =>{
    let tarefaNova = req.body;
    tarefas.push(tarefaNova)
    res.send("Tarefa adicionada!")
});

app.get('/tarefas', (req, res) => {
    res.send(tarefas)
});

app.listen(3500, () => {
    console.log('Rodando...');
});

