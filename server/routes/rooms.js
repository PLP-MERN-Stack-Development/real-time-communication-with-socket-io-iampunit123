const express = require('express');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const rooms = await Room.find()
      .populate('createdBy', 'username')
      .populate('members.user', 'username avatar');

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, description, isPrivate = false } = req.body;

    const room = await Room.create({
      name: name.toLowerCase(),
      description,
      isPrivate,
      createdBy: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }]
    });

    const populatedRoom = await Room.findById(room._id)
      .populate('createdBy', 'username')
      .populate('members.user', 'username avatar');

    res.status(201).json({
      success: true,
      data: populatedRoom
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Join a room
// @route   POST /api/rooms/:id/join
// @access  Private
router.post('/:id/join', auth, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is already a member
    const isMember = room.members.some(
      member => member.user.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this room'
      });
    }

    // Check room capacity
    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Room is at full capacity'
      });
    }

    room.members.push({ user: req.user.id });
    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('createdBy', 'username')
      .populate('members.user', 'username avatar');

    res.json({
      success: true,
      data: populatedRoom
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;