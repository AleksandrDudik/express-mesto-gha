const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000 } = process.env;

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64ac0df224bff2667cba4cf0',
  };
  next();
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Ресурс по запросу не найден' });
});

app.listen(PORT, () => { console.log(`Слушаем localhost на порту ${PORT}`); });
