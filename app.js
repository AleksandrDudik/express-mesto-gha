const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidation, userValidation } = require('./middlewares/validate');
const helmet = require('helmet');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();

const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.post('/signup', userValidation, createUser);
app.post('/signin', loginValidation, login);

app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);

app.use('*', () => {
  throw new NotFound('Ресурс не найден');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT, () => { console.log(`Слушаем localhost на порту ${PORT}`); });
