const express = require('express')
const db = require('../../config/db_config.js')
const router = express.Router()

// importacao do multer para uplod de arquivos
const multer = require('multer')

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

router.get('/cadastrar', (req, res) => {
    res.render(__dirname + '../../views/pet-cadastrar.ejs')
})

router.get('/listar', (req, res) => {
    const sql = "SELECT * FROM pet"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})

router.post('/listar/id', (req, res) => {

    let id = req.body.id

    const sql = "SELECT * FROM pet WHERE id = ?"
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})

router.post('/cadastrar', upload.single('imagem'), (req, res) => {

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

router.put('/atualizar', (req, res) => {
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

router.delete('/deletar', (req, res) => {
    let {id} = req.body

    const sql = "DELETE FROM pet WHERE id = ?;"
    
    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}`, 'titulo': `Erro`, 'icone': `error` })
        }
        return res.status(200).json({ 'resposta': `pet deletado com sucesso!`, 'titulo': `Sucesso`, 'icone': `success` })
    })
})

module.exports = router;