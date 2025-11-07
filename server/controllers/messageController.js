const Message = require('../models/Message');
const Room = require('../models/Room');

// @desc    Get messages for a room
// @route   GET /api/messages/:room
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { room } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if room exists
    const roomExists = await Room.findOne({ name: room });
    if (!roomExists) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const messages = await Message.find({ room })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Message.countDocuments({ room });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
const createMessage = async (req, res, next) => {
  try {
    const { content, room, messageType = 'text' } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      content,
      room,
      messageType
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
  deleteMessage
};