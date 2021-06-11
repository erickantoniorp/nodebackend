const { Router } = require('express');
const { check } = require('express-validator');

const { fieldsValidator } = require('../middlewares/fieldvalidator');
const { validateFileToUpload } = require('../middlewares/filevalidator');

const { uploadFile, updateImage, showImage } = require('../controllers/uploads');

const { acceptedCollections } = require('../helpers/dbvalidator');

const router = Router();

router.post('/', validateFileToUpload, uploadFile);

router.put('/:collection/:id', [
    validateFileToUpload,
    check('id', 'El id debe ser entero').isInt(),
    check('collection').custom( c=> acceptedCollections( c, ['users', 'alerts'] ) ),
    fieldsValidator
], updateImage);


router.get('/:collection/:id', [
    check('id', 'El id debe ser entero').isInt(),
    check('collection').custom( c => acceptedCollections( c, ['users','alerts'] ) ),
    fieldsValidator
], showImage  )

module.exports = router;