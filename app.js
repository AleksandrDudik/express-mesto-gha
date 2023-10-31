require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidation, userValidation } = require('./middlewares/validate');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const errorHandler = require('./middlewares/error-handler');

const app = express();

const allowedCors = [
  'https://dudik.nomoredomainsicu.ru',
  'https://api.dudik.nomoredomainsicu.ru',
  'https://localhost:3001',
  'https://localhost:3000',
  'http://dudik.nomoredomainsicu.ru',
  'http://api.dudik.nomoredomainsicu.ru',
  'http://localhost:3001',
  'http://localhost:3000',
];
const corsOptions = {
  origin(origin, callback) {
    if (allowedCors.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', userValidation, createUser);
app.post('/signin', loginValidation, login);

app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);

app.use('*', () => {
  throw new NotFound('Ресурс не найден');
});

app.use(limiter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => { console.log(`Слушаем localhost на порту ${PORT}`); });
