const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();
require('dotenv').config();


const cliente = new Client({
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'lista_tarefas',
    port: 5432
});

cliente.connect();

app.use(cors());
app.use(express.json());




app.post('/tarefas', async (req, res) => {
    await cliente.query(
        'INSERT INTO tarefas (titulo) VALUES ($1)',
        [req.body.titulo]
    );
    res.send("Tarefa Adicionada.")
});

app.put('/tarefas/:id', async (req, res) => {
    const id = Number(req.params.id);
    
    await cliente.query(
        'UPDATE tarefas SET titulo = $1 WHERE id = $2',
        [req.body.titulo, id]
    );
    res.send("Tarefa alterada.")
});


app.delete('/tarefas/:id', async (req, res) => {
    const id = Number(req.params.id);

    await cliente.query(
        'DELETE FROM tarefas WHERE id = $1',
        [id]
    );
    
    res.send("Tarefa  removida.")
});

app.get('/tarefas', async (req, res) => {
    const resultado = await cliente.query('SELECT * FROM tarefas');
    res.send(resultado.rows);
});


app.listen(3500, () => {
    console.log('Rodando...');
});

