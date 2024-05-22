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

app.get('/usuarios/listar/:id?', (req, res) => {

    let id = req.params.id

    const usuarios = [
        {
            nome: "Filipe",
            telefone: "(19) 9 8106-8804",
            email: "filipe.nascii@gmail.com"
        },
        {
            nome: "Luis",
            telefone: "(19) 9 8106-8805",
            email: "filipe_nascimentoo@hotmail.com"
        },
        {
            nome: "Giulliane",
            telefone: "(19) 9 8278-2527",
            email: "giuxavierdacruz@hotmail.com"
        }
    ]

    id ? res.json(usuarios[id]) : res.json(usuarios)
})

app.get('/pets', (req, res) => {
    res.sendFile(__dirname + '/public/pets.html')
})

app.get('/pets/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/public/pets-cadastrar.html')
})

app.get('/pets/listar', (req, res) => {
    // const pets = [
    //     'Caramelo',
    //     'Pitoco',
    //     'Pocoto'
    // ];

    const pets = [
        {
            nome: "Caramelo",
            especie: "Cachorro",
            idade: 2
        },
        {
            nome: "Chaninho",
            especie: "Gato",
            idade: 3
        },
        {
            nome: "Pocoto",
            especie: "Cavalo",
            idade: 5
        }
    ]

    res.json(pets)
})


// Define as rotas POST
app.post('/login/cadastrar', (req, res) => {
    var { nome, telefone, email, senha, confirmar } = req.body

    nome == '' ? res.send(`Campo nome é obrigatorio`) : ``;
    senha != confirmar ? res.send(`O campo senha e confirmar senha estão diferentes`) : ``;

    res.send(`${nome} seu cadastro foi realizado com sucesso`)
})

app.post('/pets/cadastrar', (req, res) => {
    var { nome, especie, idade } = req.body

    nome == '' || idade == '' || especie == '' ? res.send(`Preencha todos os campos obrigatorios`) : ``;

    res.send(`
        <h1>Cadastro realizado com sucesso!</h1>
        Nome: ${nome}<br>
        Especie: ${especie}<br>
        Idade: ${idade}
    `)
})


// Pagina de erro
app.use((req, res) => {
    res.sendFile(__dirname + '/public/404.html')
})


app.listen(porta, () => {
    console.log(`Servidor rodando http://localhost:${porta}`)
})