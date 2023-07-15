const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Слишком длинное имя'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Информация о себе должна быть более двух символов'],
    maxlength: [30, 'Информация о себе должна быть менее 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Пользователь должен загрузить аватар'],
    validate: {
      validator(v) {
        return /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/g.test(v);
      },
      message: 'url неверен',
    },
  },
});

module.exports = model('user', userSchema);
