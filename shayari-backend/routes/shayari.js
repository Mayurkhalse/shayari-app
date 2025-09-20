const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Shayari = require("../models/Shayari");
const User = require("../models/User");

// ---------------------
// Add a new Shayari (Protected)
// ---------------------
router.post("/add", auth, async (req, res) => {
  try {
    const { text, genre, isPublic } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Shayari text is required" });
    }

    const newShayari = new Shayari({
      text,
      genre: genre || "other",
      isPublic: isPublic !== undefined ? isPublic : true,
      author: req.user.userId,
    });

    await newShayari.save();
    res
      .status(201)
      .json({ message: "Shayari added successfully", shayari: newShayari });
  } catch (error) {
    console.error("Add Shayari error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// Fetch Public Shayaris (Unprotected)
// Only from public accounts & public posts
// ---------------------
router.get("/public", async (req, res) => {
  try {
    const shayaris = await Shayari.find({ isPublic: true })
      .populate("author", "username isPublic")
      .sort({ createdAt: -1 });

    // Only include if author's account is public
    const filteredShayaris = shayaris.filter((s) => s.author.isPublic);

    res.json(filteredShayaris);
  } catch (error) {
    console.error("Fetch Public Shayaris error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// Like / Unlike Shayari (Protected)
// ---------------------
router.put("/like/:id", auth, async (req, res) => {
  try {
    const shayari = await Shayari.findById(req.params.id);
    if (!shayari) return res.status(404).json({ message: "Shayari not found" });

    const userId = req.user.userId;
    const hasLiked = shayari.likes.includes(userId);

    if (hasLiked) {
      // Unlike
      shayari.likes = shayari.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      shayari.likes.push(userId);
    }

    await shayari.save();
    res.json({
      message: hasLiked ? "Unliked successfully" : "Liked successfully",
      likesCount: shayari.likes.length,
    });
  } catch (error) {
    console.error("Like/Unlike error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ---------------------
// Edit Shayari (Protected - Only Author)
// ---------------------
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const { text, genre, isPublic } = req.body;

    const shayari = await Shayari.findById(req.params.id);
    if (!shayari) return res.status(404).json({ message: "Shayari not found" });

    // Only author can edit
    if (shayari.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this shayari" });
    }

    // Update fields if provided
    if (text) shayari.text = text;
    if (genre) shayari.genre = genre;
    if (isPublic !== undefined) shayari.isPublic = isPublic;

    await shayari.save();
    res.json({ message: "Shayari updated successfully", shayari });
  } catch (error) {
    console.error("Edit Shayari error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// Delete Shayari (Protected - Only Author)
// ---------------------
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const shayari = await Shayari.findById(req.params.id);
    if (!shayari) return res.status(404).json({ message: "Shayari not found" });

    // Only author can delete
    if (shayari.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this shayari" });
    }

    await shayari.deleteOne();
    res.json({ message: "Shayari deleted successfully" });
  } catch (error) {
    console.error("Delete Shayari error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// Get all shayaris of logged-in user (Protected)
// ---------------------
router.get('/my-shayaris', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: No user info found' });
    }

    const myShayaris = await Shayari.find({ author: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(myShayaris);

  } catch (error) {
    console.error('My Shayaris error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// Get shayaris by a specific user (Public/Private rules)
// ---------------------
// Get shayaris by userId (with privacy check)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId: paramId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(paramId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const targetUser = await User.findById(paramId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Debug logs (optional)
    console.log('Requester userId:', req.user.userId);
    console.log('Target user followers:', targetUser.followers.map(id => id.toString()));

    // If account is private
    if (!targetUser.isPublic) {
      const isFollower = targetUser.followers.some(
        followerId => followerId.toString() === req.user.userId
      );
      const isOwner = req.user.userId === paramId;

      if (!isFollower && !isOwner) {
        return res.status(403).json({ message: 'This account is private' });
      }
    }

    // Fetch shayaris
    const shayaris = await Shayari.find({ author: paramId }).sort({ createdAt: -1 });

    res.json({ user: targetUser, shayaris });

  } catch (error) {
    console.error('Get user shayaris error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
