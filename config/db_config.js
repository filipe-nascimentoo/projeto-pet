require('dotenv').config();
const mysql = require('mysql2')

// cria a string de conexão
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// conecta ao banco de dados
db.connect((err) => {
    if (err) {
        console.log('Não foi possivel conectar ao banco', err)
        return
    }
    console.log('Conectado ao banco de dados')
})

module.exports = db;