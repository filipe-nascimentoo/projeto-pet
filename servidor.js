const express = require('express')

const app = express()
const porta = 4000

// define a pasta publica do projeto (public)
app.use(express('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/login',(req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/adote',(req, res) => {
    res.sendFile(__dirname + '/public/adote.html')
})

app.get('/cadastrar',(req, res) => {
    res.sendFile(__dirname + '/public/cadastro.html')
})

app.listen(porta, () => {
    console.log(`Servidor rodando na porta http://localhost:${porta}`)
})