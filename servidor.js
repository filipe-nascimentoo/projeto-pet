const express = require('express')
const mysql = require('mysql2')

const app = express()

// importacao do multer para uplod de arquivos
const multer = require('multer')
// importacao do modulo nativo patch
const path = require('path')


const porta = 4000


// Midleware para conteudo estatico
app.use(express.static('public'))

// Midleware que define o padão e os dados que serão recebidos
app.use(express.urlencoded({ extended: true }))

// Converter os dados para JSON
app.use(express.json())


// Configuração do multer para salvar as imagens na pasta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


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


// Inicio pet
app.get('/pet/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/public/pet-cadastrar.html')
})

app.get('/pet/listar', (req, res) => {
    res.sendFile(__dirname + '/public/pet-listar.html')
})

app.get('/api/pet/listar', (req, res) => {
    const sql = "SELECT * FROM pet"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})
// Fim pet


// Inicio pressoas
app.get('/pessoa/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/public/pessoa-cadastrar.html')
})

app.get('/pessoa/listar', (req, res) => {
    const sql = "SELECT * FROM pessoa"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})
// Fim pessoas

// Fim as rotas GET





// Define as rotas POST

// Inicio pet
app.post('/pet/listar/id', (req, res) => {

    let id = req.body.id

    const sql = "SELECT * FROM pet WHERE id = ?"
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})

app.post('/pet/cadastrar', upload.single('imagem'), (req, res) => {

    // cria as variaveis quee armazena os valores recebidos na resquisao
    let { nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao } = req.body
    let imagem = req.file ? req.file.filename : null;

    // inserção dos dados no banco
    const query = "INSERT INTO pet (nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao, imagem) VALUES (?,?,?,?,?,?,?,?,?,?);"

    db.query(query, [nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao, imagem], (err) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json({ 'resposta': 'Pet cadastrado com sucesso!' })
    })

})
// Fim pet


// Inicio pessoa
app.post('/pessoa/listar/id', (req, res) => {

    let id = req.body.id

    const sql = "SELECT * FROM pessoa WHERE id = ?"
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})

app.post('/pessoa/cadastrar', (req, res) => {
    // criar as variaveis e armazena os valores recebidos na req
    let { cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha } = req.body

    // inserção dos dados no banco
    const sql = "INSERT INTO pessoa (cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"

    db.query(sql, [cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha], (err) => {
        if (err) {
            res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json({ 'resposta': `Cadastro realizado com sucesso!` })
    })
})
// Fim pessoa

// Fim as rotas POST





// Define as rotas PUT

// Inicio pet
app.put('/pet/atualizar', (req, res) => {
    // criar as variaveis e armazena os valores recebidos na req
    let { nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao, id } = req.body

    // inserção dos dados no banco
    const sql = "UPDATE pet SET nome = ?, raca = ?, porte = ?, data_nascimento = ?, cor = ?, sexo = ?, castrado = ?, adotado = ?, observacao = ? WHERE id = ?;"

    db.query(sql, [nome, raca, porte, data_nascimento, cor, sexo, castrado, adotado, observacao, id], (err) => {
        if (err) {
            res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json({ 'resposta': `Pet ${nome} atualizado com sucesso!` })
    })
})
// Fim pet

// Inicio pessoa
app.put('/pessoa/atualizar', (req, res) => {
    // criar as variaveis e armazena os valores recebidos na req
    let { cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha, id } = req.body

    // inserção dos dados no banco
    const sql = "UPDATE pessoa SET cpf = ?, nome = ?, email = ?, rua = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, estado = ?, cep = ?, rg = ?, telefone = ?, data_nascimento = ?, senha = ? WHERE id = ?;"

    db.query(sql, [cpf, nome, email, rua, numero, bairro, complemento, cidade, estado, cep, rg, telefone, data_nascimento, senha, id], (err) => {
        if (err) {
            res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json({ 'resposta': `Registro do usuário ${nome} atualizado com sucesso!` })
    })
})
// Fim pet





// Define as rotas DELETE

// Inicio pet
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
// Fim pet

// Inicio pessoa
app.delete('/pessoa/deletar', (req, res) => {
    let {id} = req.body

    const sql = "DELETE FROM pessoa WHERE id = ?;"
    
    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}`, 'titulo': `Erro`, 'icone': `error` })
        }
        return res.status(200).json({ 'resposta': `usuário deletado com sucesso!`, 'titulo': `Sucesso`, 'icone': `success` })
    })
})
// Fim pessoa

// Fim as rotas DELETE







// Pagina de erro
app.use((req, res) => {
    res.sendFile(__dirname + '/public/404.html')
})


app.listen(porta, () => {
    console.log(`Servidor rodando http://localhost:${porta}`)
})