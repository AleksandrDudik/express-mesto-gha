const express = require('express');

const router = express.Router();
const {
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');
const { userAboutValidation, avatarValidation, idValidation } = require('../middlewares/validate');

router.get('/users', idValidation, getCurrentUser);
router.get('/users', getAllUsers);
router.get('/users/:_id', idValidation, getUserById);
router.patch('/users/me', userAboutValidation, updateUser);
router.patch('/users/me/avatar', avatarValidation, updateUserAvatar);

module.exports = router;
