const express = require('express')
const mysql = require('mysql2')

const app = express()
const porta = 4000


// Midleware para conteudo estatico
app.use(express.static('public'))

// Midleware que define o padão e os dados que serão recebidos
app.use(express.urlencoded({ extended: true }))

// Converter os dados para JSON
app.use(express.json())


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


// Define as rotas GET
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/pet/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/public/pet-cadastrar.html')
})

app.get('/pet/listar', (req, res) => {
    const sql = "SELECT * FROM pet"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `Não foi possível listar os pets: ${err}` })
        }
        return res.status(200).json(results)
    })
})

app.get('/pet/listar', (req, res) => {
    const sql = "SELECT * FROM pet"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `Não foi possível listar os Pets: ${err}` })
        }
        return res.status(200).json(results)
    })
})



app.post('/pet/listar/id', (req, res) => {

    let id = req.body.id

    const sql = "SELECT * FROM pet WHERE id = ?"
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `Não foi possível retornar as informações do Pet: ${err}` })
        }
        return res.status(200).json(results)
    })
})

app.post('/pet/cadastrar', (req, res) => {
    // criar as variaveis e armazena os valores recebidos na req
    let { nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao } = req.body

    // inserção dos dados no banco
    const sql = "INSERT INTO pet (nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"

    db.query(sql, [nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao], (err) => {
        if (err) {
            res.status(500).json({ 'resposta': `Não foi possível inserir o pet: ${err}` })
        }
        return res.status(200).json({ 'resposta': `Pet cadastrado com sucesso!` })
    })
})



app.delete('/pet/deletar', (req, res) => {
    let {id} = req.body

    const sql = "DELETE FROM pet WHERE id = ?;"
    
    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}`, 'titulo': `Erro`, 'icone': `error` })
        }
        return res.status(200).json({ 'resposta': `pet deletado com sucesso!`, 'titulo': `Sucesso`, 'icone': `success` })
    })
})


app.put('/pet/atualizar', (req, res) => {
    // criar as variaveis e armazena os valores recebidos na req
    let { nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao, id } = req.body

    // inserção dos dados no banco
    const sql = "UPDATE pet SET nome = ?, raca = ?, porte = ?, data_nascimento = ?, cor = ?, sexo = ?, castrado = ?, adotado = ?, observacao = ? WHERE id = ?;"

    db.query(sql, [nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao, id], (err) => {
        if (err) {
            res.status(500).json({ 'resposta': `Não foi possível inserir o pet: ${err}` })
        }
        return res.status(200).json({ 'resposta': `Pet cadastrado com sucesso!` })
    })
})





app.get('/pessoa/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/public/pessoa-cadastrar.html')
})

app.post('/pessoa/cadastrar', (req, res) => {
    // criar as variaveis e armazena os valores recebidos na req
    let { cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha } = req.body

    // inserção dos dados no banco
    const sql = "INSERT INTO pessoa (cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"

    db.query(sql, [cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha], (err) => {
        if (err) {
            res.status(500).json({ 'resposta': `Não foi possível inserir o novo cadastro: ${err}` })
        }
        return res.status(200).json({ 'resposta': `Cadastro realizado com sucesso!` })
    })
})

app.get('/pessoa/listar', (req, res) => {
    const sql = "SELECT * FROM pessoa"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `Não foi possível listar os Pets: ${err}` })
        }
        return res.status(200).json(results)
    })
})

app.delete('/pessoa/deletar', (req, res) => {
    let {id} = req.body

    const sql = "DELETE FROM pessoa WHERE id = ?;"
    
    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}`, 'titulo': `Erro`, 'icone': `error` })
        }
        return res.status(200).json({ 'resposta': `usuario deletado com sucesso!`, 'titulo': `Sucesso`, 'icone': `success` })
    })
})




// Pagina de erro
app.use((req, res) => {
    res.sendFile(__dirname + '/public/404.html')
})


app.listen(porta, () => {
    console.log(`Servidor rodando http://localhost:${porta}`)
})