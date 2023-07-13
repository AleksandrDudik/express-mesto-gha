const express = require('express');

const router = express.Router();
const {
  getAllCards,
  createCard,
  likeCard,
  deleteCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
