const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let tarefas = [];
let contador = 0;

app.post('/tarefas', (req, res) => {
    let tarefaNova = {
        id: contador,
        titulo: req.body.titulo
    };
    contador++;
    tarefas.push(tarefaNova)    
    res.send("Tarefa adicionada!")
});

app.put('/tarefas/:id', (req, res) => {
    let id = Number(req.params.id);
    for (let i = 0; i < tarefas.length; i++){
        if (tarefas[i].id === id){
            tarefas[i].titulo = req.body.titulo;
        }
    }
    res.send("Tarefa alterada.");
})

app.delete('/tarefas/:id', (req, res) => {
    let nova_lista = [];

    let id = Number(req.params.id);
    for (let i = 0; i < tarefas.length; i++){
        if (tarefas[i].id !== id){
            nova_lista.push(tarefas[i]);
        }
    }

    tarefas = nova_lista;

    res.send("Tarefa  removida;")

});

app.get('/tarefas', (req, res) => {
    res.send(tarefas)
});


app.listen(3500, () => {
    console.log('Rodando...');
});

