const { Router } = require('express');
const { check } = require('express-validator');

const { userGet, userDelete, userPatch, userPost, userPut } = require('../controllers/user');

const { fieldsValidator } = require('../middlewares/fieldvalidator');
const { validateJWT } = require('../middlewares/jwtvalidator');
const { adminRoleValidation, roleValidation } = require('../middlewares/rolevalidator');

const router = Router();

router.get('/', userGet );

router.post('/', [
    check('correo', 'El correo no es válido').isEmail(),
    check('nombres', 'El nombre es Obligatorio').not().isEmpty(),
    check('apellidop', 'El Apellido Paterno es Obligatorio').not().isEmpty(),
    check('apellidom', 'El Apellido Materno es Obligatorio').not().isEmpty(),
    check('clave', 'La Clave es Obligatoria y al menos de 6 letras').isLength({ min: 6 }),
    fieldsValidator
    ],
    userPost );

router.put('/:id', userPut );

router.delete('/:id', [
    validateJWT,
    adminRoleValidation
], userDelete );

router.patch('/', userPatch );

module.exports = router;