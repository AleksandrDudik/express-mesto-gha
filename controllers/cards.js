const Card = require('../models/card');

const getAllCards = (req, res) => {
  try {
    const allCards = Card.find({});
    res.status(200).send(allCards);
  } catch (err) {
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  try {
    const cardCreate = Card.create({ name, link, owner: req.user._id });
    res.status(200).send(cardCreate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    }
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

const likeCard = (req, res) => {
  try {
    const cardLike = Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(new Error('NotValidId'));
    res.status(200).send(cardLike);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    } if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'Данные карточки не найдены' });
    } else {
      res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
    }
  }
};

const deleteCard = (req, res) => {
  try {
    const cardDelete = Card.findByIdAndRemove({ _id: req.params.cardId })
      .orFail(new Error('NotValidId'));
    res.status(200).send({ message: `Данные карточки удалили ${cardDelete}` });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    } if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'Данные карточки не найдены' });
    } else {
      res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
    }
  }
};

const dislikeCard = (req, res) => {
  try {
    const cardDislike = Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(new Error('NotValidId'));
    res.status(200).send(cardDislike);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    } if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'Данные карточки не найдены' });
    } else {
      res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
    }
  }
};

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  deleteCard,
  dislikeCard,
};
