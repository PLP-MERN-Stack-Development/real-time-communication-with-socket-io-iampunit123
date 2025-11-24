<<<<<<< HEAD
const express = require('express');
const {
  getMessages,
  createMessage,
  deleteMessage
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/:room', auth, getMessages);
router.post('/', auth, createMessage);
router.delete('/:id', auth, deleteMessage);

=======
const express = require('express');
const {
  getMessages,
  createMessage,
  deleteMessage
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/:room', auth, getMessages);
router.post('/', auth, createMessage);
router.delete('/:id', auth, deleteMessage);

>>>>>>> master
module.exports = router;