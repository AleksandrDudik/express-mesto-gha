const User = require('../models/user');

const getAllUsers = (req, res) => {
  try {
    const allUsers = User.find({});
    res.status(200).send(allUsers);
  } catch (err) {
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

const getUserById = (req, res) => {
  try {
    const user = User.findById({ _id: req.params.id })
      .orFail(new Error('NotValidId'));
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    } if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'Данные ользователя не найдены' });
    } else {
      res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
    }
  }
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  try {
    const userUpdate = User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(new Error('NotValidId'));
    res.status(200).send(userUpdate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    }
    if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'Данные ользователя не найдены' });
    } else {
      res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
    }
  }
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  try {
    const userUpdate = User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(new Error('NotValidId'));
    res.status(200).send(userUpdate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    } if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'Данные ользователя не найдены' });
    } else {
      res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
    }
  }
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const newUser = User.create({ name, about, avatar });
    res.status(200).send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    }
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  createUser,
};
