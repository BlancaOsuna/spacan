const express = require('express');
const path = require('path');
const morgan = require('morgan');
// const mysql = require('mysql');
const mysql = require('mysql2');
const myConnection = require('express-myconnection');
const fs = require('fs'); 

const app = express();

// Importando rutas
const customerRoutes = require('./routes/customer');

// Configuraciones
app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares : son funciones que se ejecutan antes de las peticiones de los usuarios
app.use(morgan('dev'));

const mysqlConfig = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    port: process.env.port,
    database: process.env.database
};

if (process.env.is_prod) {
    mysqlConfig.ssl = {
        ca: fs.readFileSync(__dirname + '/../certs/ca.pem')
    };
}

app.use(myConnection(mysql, mysqlConfig, 'single'));

app.use(express.urlencoded({ extended: false }));

// Variables de sesión
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
app.set('trust proxy', 1);
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    })
}));

// Rutas
app.use('/', customerRoutes);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Empezando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});

// Login

// Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/servicios', (req, res) => {
    res.render('servicios');
});

app.get('/crud-nodejs-mysql/app.js', (req, res) => {
    res.render('servicios');
});

// Registro
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const correo = req.body.correo;
    const celular = req.body.celular;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    req.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error de conexión a la base de datos');
            return;
        }

        connection.query('INSERT INTO users SET ?', { user: user, name: name, correo: correo, celular: celular, pass: passwordHaash }, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al insertar los datos');
            } else {
                res.render('register', {
                    alert: true,
                    alertTittle: "Registration",
                    alertMessage: "Successful Registration",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login'
                });
            }
        });
    });
});

// Autenticación
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    if (user && pass) {
        req.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error de conexión a la base de datos');
                return;
            }

            connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error al realizar la consulta');
                    return;
                }

                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('login', {
                        alert: true,
                        alertTittle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD INCORRECTAS",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                } else {
                    req.session.loggedin = true;
                    req.session.name = results[0].name;
                    req.session.user_id = results[0].id;
                    res.render('login', {
                        alert: true,
                        alertTittle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    });
                }
                res.end();
            });
        });
    } else {
        res.send('Please enter user and Password!');
        res.end();
    }


});


//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res) => {
    console.log('HOOLA');
    console.log(req.session);
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    res.end();
});

//Logout
//13- Destruye la sesión.
app.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
    })
});
