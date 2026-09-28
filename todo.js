const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
require('dotenv').config();


const pool = new Pool({
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'lista_tarefas',
    port: 5432
});

app.use(cors());
app.use(express.json());


//Cadastro
app.post('/cadastro', async (req, res) =>{
    const { email, senha, nome } = req.body;
    const resultado = await pool.query(
        'SELECT email, senha, nome FROM usuarios WHERE email = $1',
        [email]
    );

    if (email.trim().length === 0 || senha.trim().length === 0 || nome.trim().length === 0){
        return res.status(400).json({ erro: 'Não é permitido deixar os campos E-mail, Senha e/ou Nome vazios.'})
    };
    
    if (resultado.rows.length > 0) {
        return res.status(400).json({ erro: 'E-mail já cadastrado, favor usar outro e-mail para cadastro.'});
    };
    await pool.query(
            'INSERT INTO usuarios (email, senha, nome) VALUES ($1, $2, $3)',
            [email, senha, nome]
        )
        return res.status(201).json({ mensagem: "E-mail cadastrado com sucesso."});
});


//Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const resultado = await pool.query(
            'SELECT id, email, senha FROM usuarios WHERE email = $1',
            [email]
            )
            if(resultado.rows.length === 0){
                return res.status(404).json({ erro: "E-mail não cadastrado."})
            } else {
                const usuario = resultado.rows[0];
                if (usuario.senha !== senha){
                    return res.status(401).json({ erro: "Senha inválida."})
                } else {
                    return res.status(200).json({ id: usuario.id, email: usuario.email })
                }
             }
            } catch (error) {
                console.error("Erro na rota POST /login", error);
                return res.status(500).json({ erro: "Erro interno no servidor."})
            }
        
        });
//CRUD INSERT
app.post('/tarefas', async (req, res) => {
    const { titulo, usuario_id } = req.body
    try {
        
        if (!titulo || titulo.trim().length === 0 || !usuario_id){
            return res.status(400).json({ erro: "Título e ID é obrigatório."});
        }
        const resultado = await pool.query(
            'INSERT INTO tarefas (titulo, usuario_id) VALUES ($1, $2) RETURNING *',
            [titulo.trim(), usuario_id]
        );

        return res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error("Erro na rota POST /tarefas:", error);
        return res.status(500).json({ erro: "Erro interno no servidor."})
    }
    });
    
//CRUD UPDATE
app.put('/tarefas/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { titulo } = req.body;

    try {

        if (!titulo || titulo.trim().length === 0){
            return res.status(400).json({ erro: "Título é obrigatório." });
        }
        
        
        const resultado = await pool.query('UPDATE tarefas SET titulo = $1 WHERE id = $2 RETURNING *',
            [titulo.trim(), id]
        )
        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Erro na rota PUT /tarefas/:id", error);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }
        
    });

//CRUD DELETE
app.delete('/tarefas/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const resultado = await pool.query('DELETE FROM tarefas WHERE id = $1',
            [id]
        )
        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Erro na rota DELETE /tarefas/:id", error);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }
        
    });

//CRUD SELECT
app.get('/tarefas/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    
    try {
        const resultado = await pool.query('SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY id ASC',
            [usuario_id]
        );
        
        return res.status(200).json(resultado.rows);
    } catch (error){
        console.error("Erro ao buscar tarefas:", error);
        res.status(500).json({ erro: "Erro interno no servidor." })
    };
});


app.listen(3500, () => {
    console.log('Rodando...');
});

