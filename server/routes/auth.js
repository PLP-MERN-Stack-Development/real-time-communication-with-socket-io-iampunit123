<<<<<<< HEAD
const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

=======
const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

>>>>>>> master
module.exports = router;