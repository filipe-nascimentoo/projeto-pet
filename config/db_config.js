const mysql = require('mysql2')

// cria a string de conexão
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_adote_pet'
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