const express = require('express')
const app = express()





const porta = 4000

app.set('view engine', 'ejs');

const db = require('./config/db_config.js')

// Midleware para conteudo estatico
app.use(express.static('public'))

// Midleware que define o padão e os dados que serão recebidos
app.use(express.urlencoded({ extended: true }))

// Converter os dados para JSON
app.use(express.json())



app.get('/', (req, res) => {
    res.render(__dirname + '/public/index.ejs')
})

const rotasAdmins = require('./public/routes/admin.js')
app.use('/admin', rotasAdmins )

const rotasPessoas = require('./public/routes/pessoa.js')
app.use('/pessoa', rotasPessoas )

const rotasPets = require('./public/routes/pet.js') 
app.use('/pet', rotasPets )

// Pagina de erro
app.use((req, res) => {
    res.sendFile(__dirname + '/public/404.html')
})


app.listen(porta, () => {
    console.log(`Servidor rodando http://localhost:${porta}`)
})