const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  createUser,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
