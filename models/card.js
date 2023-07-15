const { Schema, model } = require('mongoose');
const { ObjectId } = require('mongodb');

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Слишком короткое название карточки'],
    maxlength: [30, 'Название должно быть менее 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Должна присутствовать ссылка на карточку'],
    validate: {
      validator(v) {
        return /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/g.test(v);
      },
      message: 'url неверен',
    },
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: [ObjectId],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.new,
  },
});

module.exports = model('card', cardSchema);
