const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidation, userValidation } = require('./middlewares/validate');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const errorHandler = require('./middlewares/error-handler');

const app = express();

const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

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
app.use(errorHandler);

app.listen(PORT, () => { console.log(`Слушаем localhost на порту ${PORT}`); });
