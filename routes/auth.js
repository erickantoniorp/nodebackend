const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { fieldsValidator } = require('../middlewares/fieldvalidator');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('clave', 'La contraseña es obligatoria').not().isEmpty(),
    fieldsValidator
], login );

module.exports = router;