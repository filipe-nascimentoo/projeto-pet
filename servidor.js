const express = require('express')

const app = express()
const porta = 4000


// Midleware para conteudo estatico
app.use(express.static('public'))

// Midleware que define o padão e os dados que serão recebidos
app.use(express.urlencoded({ extended: true }))

// Converter os dados para JSON
app.use(express.json())


// Define as rotas GET
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/login/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/public/login-cadastrar.html')
})

app.get('/pets', (req, res) => {
    res.sendFile(__dirname + '/public/pets.html')
})

app.get('/pets/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/public/pets-cadastrar.html')
})


// Define as rotas POST
app.post('/login/cadastrar', (req, res) => {
    var { nome, telefone, email, senha, confirmar } = req.body

    res.send(`${nome} seu cadastro foi realizado com sucesso`)
})


// Pagina de erro
app.use((req, res) => {
    res.sendFile(__dirname + '/public/404.html')
})


app.listen(porta, () => {
    console.log(`Servidor rodando http://localhost:${porta}`)
})