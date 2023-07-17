const Card = require('../models/card');

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const cardCreate = await Card.create({ name, link, owner: req.user._id });
    res.status(200).send(cardCreate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    }
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

const getAllCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    res.status(200).send(allCards);
  } catch (err) {
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

const likeCard = async (req, res) => {
  try {
    const cardLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
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

const deleteCard = async (req, res) => {
  try {
    const cardDelete = await Card.findByIdAndRemove({ _id: req.params.cardId });
    res.status(200).send({ message: `Данные карточки удалены ${cardDelete}` });
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

const dislikeCard = async (req, res) => {
  try {
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
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
  createCard,
  getAllCards,
  likeCard,
  deleteCard,
  dislikeCard,
};
