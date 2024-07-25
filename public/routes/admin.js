const express = require('express')
const db = require('../../config/db_config.js')
const session = require('express-session');
const router = express.Router()


// Rotas Admin

router.use(session({
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

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/admin/dashboard');  // Redireciona para o dashboard se já estiver logado
    } else {
        res.render(__dirname + '../../admin/views/login.ejs');
    }
});

router.get('/dashboard', autenticaLogin, (req, res) => {
    res.render(__dirname + '../../admin/views/dashboard.ejs');
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