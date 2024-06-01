const express = require('express');
const router = express.Router();


const customerController = require ('../controllers/custumerController');

router.get('/', customerController.list);
router.post('/add', customerController.save);
router.get('/delete/:id', customerController.delete);

router.get('/update/:id', customerController.edit)
router.post('/update/:id', customerController.update)

router.get('/index', (req, res) => {
    res.render('index'); // Aquí 'index' es el nombre de tu vista, asegúrate de que exista en tu directorio 'views'
});

router.get('/servicios', (req, res) => {
    res.render('servicios'); // Aquí 'index' es el nombre de tu vista, asegúrate de que exista en tu directorio 'views'
});

router.get('/estilistas', (req, res) => {
    res.render('estilistas'); // Aquí 'index' es el nombre de tu vista, asegúrate de que exista en tu directorio 'views'
});

router.get('/register', (req, res) => {
    res.render('register'); // Aquí 'index' es el nombre de tu vista, asegúrate de que exista en tu directorio 'views'
});

router.get('/login', (req, res) => {
    res.render('login'); // Aquí 'index' es el nombre de tu vista, asegúrate de que exista en tu directorio 'views'
});
module.exports = router;
