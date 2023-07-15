const userSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getAllUsers = (request, response, next) => {
  userSchema
    .find({})
    .then((users) => response.send(users))
    .catch(next);
};

module.exports.getUserById = (request, response, next) => {
  const { userId } = request.params;

  userSchema
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User cannot be found');
      }
      response.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Incorrect id'));
      }
      return next(err);
    });
};

module.exports.createUser = (request, response, next) => {
  const {
    name,
    about,
    avatar,
  } = request.body;

  userSchema
    .create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User cannot be created');
      }
      response.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (request, response, next) => {
  const {
    name,
    about,
  } = request.body;

  userSchema
    .findByIdAndUpdate(
      request.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User cannot be found');
      }
      response.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (request, response, next) => {
  const { avatar } = request.body;

  userSchema
    .findByIdAndUpdate(
      request.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => response.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};
