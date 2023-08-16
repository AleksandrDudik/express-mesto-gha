const express = require('express');

const router = express.Router();
const {
  createCard,
  getAllCards,
  likeCard,
  deleteCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardValidation, idValidation } = require('../middlewares/validate');

router.post('/cards', cardValidation, createCard);
router.get('/cards', getAllCards);
router.put('/cards/:_id/likes', idValidation, likeCard);
router.delete('/cards/:_id', idValidation, deleteCard);
router.delete('/cards/:_id/likes', idValidation, dislikeCard);

module.exports = router;
