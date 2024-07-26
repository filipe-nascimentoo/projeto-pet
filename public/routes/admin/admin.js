const express = require('express')
const db = require('../../../config/db_config.js')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const router = express.Router()


// Rotas Admin

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

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/admin/dashboard');  // Redireciona para o dashboard se já estiver logado
    } else {
        res.render(__dirname + '../../../views/admin/login.ejs', { title: 'Login' });
    }
});

router.get('/dashboard', autenticaLogin, (req, res) => {
    const { nome } = req.session.user;
    res.render(__dirname + '../../../views/admin/dashboard.ejs', { nome: nome, title: 'Dashboard' });
});

router.post('/login', (req, res) => {
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

router.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: `Erro ao fazer logout: ${err}` });
        }
        res.status(200).json({ success: true, message: 'Logout bem-sucedido!' });
    });
});

module.exports = router;
// Fim Rotas Admin