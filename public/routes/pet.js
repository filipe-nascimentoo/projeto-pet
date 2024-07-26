const express = require('express')
const db = require('../../config/db_config.js')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
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



const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
router.use(session({
    secret: 'sahsuamfghcjgkdlee',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Em produção, defina como true se estiver usando HTTPS
        // maxAge: 300000 // Tempo de expiração em milissegundos (300 segundos)
    }
}));

// Reset na cache após o usuário desconectar não permitindo que o usuário utilize o botão de voltar do navegador para acessar a última pagina logado
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

function autenticaLogin(req, res, next) {
    if (req.session.user) {
        // console.log('Usuário', req.session.user)
        next();
    } else {
        res.redirect('/admin');
    }
}

router.get('/cadastrar', autenticaLogin, (req, res) => {
    res.render(__dirname + '../../views/pet-cadastrar.ejs', { title: 'Cadastrar' })
})

router.get('/listar', (req, res) => {
    res.render(__dirname + '../../views/pet-listar.ejs', { title: 'Listar' })
})

router.get('/api/listar', (req, res) => {
    const sql = "SELECT * FROM pet"
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` })
        }
        return res.status(200).json(results)
    })
})

router.get('/api/grafico', (req, res) => {
    const sql = `
        SELECT 
            data.dia,
            IFNULL(u.pessoas, 0) AS pessoas,
            IFNULL(v.pets, 0) AS pets,
            IFNULL(e.adocao, 0) AS adocao
        FROM
            (SELECT DATE(data_cadastro) AS dia FROM pessoa
            UNION
            SELECT DATE(data_cadastro) AS dia FROM adocao
            UNION
            SELECT DATE(data_cadastro) AS dia FROM pet) AS data
        LEFT JOIN
            (SELECT DATE(data_cadastro) AS dia, COUNT(*) AS pessoas FROM pessoa GROUP BY dia) AS u
        ON data.dia = u.dia
        LEFT JOIN
            (SELECT DATE(data_cadastro) AS dia, COUNT(*) AS adocao FROM adocao GROUP BY dia) AS e
        ON data.dia = e.dia
        LEFT JOIN
            (SELECT DATE(data_cadastro) AS dia, COUNT(*) AS pets FROM pet GROUP BY dia) AS v
        ON data.dia = v.dia
        ORDER BY data.dia;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}` });
        }

        // Formatar os dados para o gráfico
        const datas = results.map(row => row.dia.toISOString().split('T')[0]);
        const pessoas = results.map(row => row.pessoas);
        const pets = results.map(row => row.pets);
        const adocao = results.map(row => row.adocao);

        res.json({ datas, pessoas, pets, adocao });
    });
});

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
    let { id } = req.body

    const sql = "DELETE FROM pet WHERE id = ?;"

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ 'resposta': `${err}`, 'titulo': `Erro`, 'icone': `error` })
        }
        return res.status(200).json({ 'resposta': `pet deletado com sucesso!`, 'titulo': `Sucesso`, 'icone': `success` })
    })
})

module.exports = router;