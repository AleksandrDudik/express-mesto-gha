const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFound('Карточка с данным id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { _id } = req.params;

  Card.findById(_id)
    .orFail()
    .catch(() => {
      throw new NotFound('Карточка с данным id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndRemove(_id)
          .then((datacard) => res.send(datacard));
      } else {
        throw new Forbidden('У Вас недостаточно прав доступа');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFound('Карточка с данным id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports = {
  createCard,
  getAllCards,
  likeCard,
  deleteCard,
  dislikeCard,
};
