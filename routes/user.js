const { Router } = require('express');

const { userGet, userDelete, userPatch, userPost, userPut } = require('../controllers/user');

const router = Router();

router.get('/', userGet );
router.post('/', userPost );
router.put('/:id', userPut );
router.delete('/', userDelete );
router.patch('/', userPatch );

module.exports = router;