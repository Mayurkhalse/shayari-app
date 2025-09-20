// routes/user.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_a_strong_secret';

// ---------------------
// Register
// ---------------------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email, isPublic: newUser.isPublic }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// Login
// ---------------------
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, email, password } = req.body;
const identifier = emailOrUsername || email;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully.',
      token,
      user: { id: user._id, username: user.username, email: user.email, isPublic: user.isPublic }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// Toggle Account Visibility (Protected)
// ---------------------
router.put('/toggle-visibility', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isPublic = !user.isPublic;
    await user.save();

    res.json({
      message: `Account visibility changed to ${user.isPublic ? 'Public' : 'Private'}`,
      isPublic: user.isPublic
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle account privacy (Protected)
router.put('/privacy', auth, async (req, res) => {
  try {
    const { isPublic } = req.body;

    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({ message: 'isPublic must be true or false' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { isPublic },
      { new: true }
    ).select('-password'); // don't return password

    res.json({
      message: `Account privacy updated to ${isPublic ? 'Public' : 'Private'}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Privacy toggle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Send follow request or auto-follow if public
router.post('/follow/:id', auth, async (req, res) => {
  try {
    if (req.user.userId === req.params.id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const currentUser = await User.findById(req.user.userId);

    if (targetUser.isPublic) {
      // Public account → auto follow
      if (!targetUser.followers.includes(currentUser._id)) {
        targetUser.followers.push(currentUser._id);
        currentUser.following.push(targetUser._id);
        await targetUser.save();
        await currentUser.save();
      }
      return res.json({ message: 'Followed successfully' });
    } else {
      // Private account → send request
      if (!targetUser.followRequests.includes(currentUser._id)) {
        targetUser.followRequests.push(currentUser._id);
        await targetUser.save();
        return res.json({ message: 'Follow request sent' });
      }
      return res.status(400).json({ message: 'Request already sent' });
    }
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve follow request
router.post('/approve-follow/:id', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.user.userId);
    const requesterId = req.params.id;

    if (!targetUser.followRequests.includes(requesterId)) {
      return res.status(400).json({ message: 'No such follow request' });
    }

    targetUser.followRequests = targetUser.followRequests.filter(id => id.toString() !== requesterId);
    targetUser.followers.push(requesterId);

    const requester = await User.findById(requesterId);
    requester.following.push(targetUser._id);

    await targetUser.save();
    await requester.save();

    res.json({ message: 'Follow request approved' });
  } catch (error) {
    console.error('Approve follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject follow request
router.post('/reject-follow/:id', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.user.userId);
    const requesterId = req.params.id;

    targetUser.followRequests = targetUser.followRequests.filter(id => id.toString() !== requesterId);
    await targetUser.save();

    res.json({ message: 'Follow request rejected' });
  } catch (error) {
    console.error('Reject follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// View follow requests
router.get('/follow-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('followRequests', 'username email');
    res.json(user.followRequests);
  } catch (error) {
    console.error('Get follow requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Unfollow a user
router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.userId);

    if (!userToUnfollow) return res.status(404).json({ message: 'User not found' });

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: `You unfollowed ${userToUnfollow.username}` });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// 📌 Get my followers
router.get('/followers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('followers', 'username email');
    res.json(user.followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Get my following list
router.get('/following', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('following', 'username email');
    res.json(user.following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
