const express = require('express')

const app = express()
const porta = 4000

app.get('/', (req, res) => {
    res.send('Pagina principal')
})

app.get('/login',(req, res) => {
    res.send('Pagina de login')
})

app.get('/adote',(req, res) => {
    res.send('Pagina de adoção')
})

app.get('/cadastrar',(req, res) => {
    res.send('Pagina de cadastro')
})


app.listen(porta, () => {
    console.log(`Servidor rodando na porta http://localhost:${porta}`)
})