const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauce');

router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Route pour gérer les likes et dislikes
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;






