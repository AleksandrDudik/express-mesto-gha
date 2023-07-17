const User = require('../models/user');

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const newUser = await User.create({ name, about, avatar });
    res.status(200).send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверные данные' });
      return;
    }
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers);
  } catch (err) {
    res.status(500).send({ message: `Общая ошибка на сервере: ${err}` });
  }
};

const getUserById = async (req, res) => {
  try {
    const userById = await User.findById({ _id: req.params.id });
    res.status(200).send(userById);
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

const updateUser = async (req, res) => {
  const { name, about } = req.body;
  try {
    const userUpdateById = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(userUpdateById);
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

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const userAvatarUpdateById = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(userAvatarUpdateById);
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
};
