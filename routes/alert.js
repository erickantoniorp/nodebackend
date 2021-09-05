const { Router }            = require('express');
const { check }             = require('express-validator');


const { alertGet, alertDelete, alertPatch, alertPost, alertPut, alertWithImagePost, alertWithImage2 } = require('../controllers/alert');

const { fieldsValidator }   = require('../middlewares/fieldvalidator');
const { validateJWT }       = require('../middlewares/jwtvalidator');
const { adminRoleValidation, roleValidation } = require('../middlewares/rolevalidator');
const { userIdExists }      = require('../middlewares/alertvalidator');

//const uploadMulter  = require('../middlewares/uploadmulter');
//const multer = require('multer');

const router                = Router();

const multer                = require('multer');
const mystorage             = multer.memoryStorage();
const upload                = multer({ storage: mystorage });

router.post('/', [
    userIdExists,
    check('idusuario', 'El id no es válido').isInt(),
    check('gps', 'Las coordenadas gps son obligatorias').not().isEmpty(),
    check('nivelbateria', 'El nivel de bateria no es válido').isInt(),
    check('fechamovil', 'La Fecha del Movil es Obligatorio').not().isEmpty(),
    check('horamovil', 'La Hora del Movil es Obligatoria y al menos de 6 letras').not().isEmpty(),
    fieldsValidator
    ],
    alertPost );

router.post('/withimage', alertWithImagePost );
router.post('/withotherimage', upload.single('archivo'), alertWithImage2 );

router.put('/:id', alertPut );

router.delete('/:id', [
    validateJWT,
    adminRoleValidation
], alertDelete );

router.patch('/', alertPatch );

module.exports = router;