const express = require('express')
const db = require('../../config/db_config.js')
const router = express.Router()


router.get('/cadastrar', (req, res) => {
    res.render(__dirname + '../../views/pessoa-cadastrar.ejs')
})

router.get('/listar', (req, res) => {
    const sql = "SELECT * FROM pessoa"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})

router.post('/listar/id', (req, res) => {

    let id = req.body.id

    const sql = "SELECT * FROM pessoa WHERE id = ?"
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})

router.post('/cadastrar', (req, res) => {
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

router.put('/atualizar', (req, res) => {
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

router.delete('/deletar', (req, res) => {
    let {id} = req.body

    const sql = "DELETE FROM pessoa WHERE id = ?;"
    
    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}`, 'titulo': `Erro`, 'icone': `error` })
        }
        return res.status(200).json({ 'resposta': `usuário deletado com sucesso!`, 'titulo': `Sucesso`, 'icone': `success` })
    })
})

module.exports = router;