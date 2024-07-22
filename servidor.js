const express = require('express')
const session = require('express-session');

const app = express()


// importacao do modulo nativo patch
const path = require('path')


const porta = 4000

app.set('view engine', 'ejs');

const db = require('./config/db_config.js')

// Midleware para conteudo estatico
app.use(express.static('public'))

// Midleware que define o padão e os dados que serão recebidos
app.use(express.urlencoded({ extended: true }))

// Converter os dados para JSON
app.use(express.json())

app.use(session({
    secret: 'seu_segredo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Em produção, defina como true se estiver usando HTTPS
}));



function autenticaLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/admin');
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Rotas Admin

app.get('/admin/dashboard', autenticaLogin, (req, res) => {
    res.sendFile(__dirname + '/public/admin/views/dashboard.html');
});

app.get('/admin', (req, res) => {
    if (req.session.user) {
        res.redirect('/admin/dashboard');  // Redireciona para o dashboard se já estiver logado
    } else {
        res.sendFile(__dirname + '/public/admin/views/login.html');
    }
});

app.post('/admin/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM pessoa WHERE email = ? AND senha = ?";
    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: `Erro no servidor: ${err}` });
        }

        if (results.length > 0) {
            // Autenticação bem-sucedida
            req.session.user = results[0];
            res.status(200).json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            // Credenciais inválidas
            res.status(401).json({ success: false, message: 'Email ou senha incorretos!' });
        }
    });
});

app.post('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: `Erro ao fazer logout: ${err}` });
        }
        res.status(200).json({ success: true, message: 'Logout bem-sucedido!' });
    });
});

// Fim Rotas Admin


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