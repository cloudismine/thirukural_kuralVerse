import express from 'express';
import User from '../models/User.js';
import Kural from '../models/Kural.js';
import Comment from '../models/Comment.js';
import { authenticateToken, requireOwnershipOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/users/favorites - Add Kural to favorites
router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { kuralNumber } = req.body;
    const user = req.user;
    
    if (!kuralNumber || isNaN(kuralNumber) || kuralNumber < 1 || kuralNumber > 1330) {
      return res.status(400).json({
        success: false,
        error: 'Valid Kural number (1-1330) is required'
      });
    }
    
    // Check if Kural exists
    const kural = await Kural.findOne({ number: parseInt(kuralNumber) });
    if (!kural) {
      return res.status(404).json({
        success: false,
        error: 'Kural not found'
      });
    }
    
    // Check if already in favorites
    const existingFavorite = user.activity.favoriteKurals.find(
      fav => fav.kuralNumber === parseInt(kuralNumber)
    );
    
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        error: 'Kural is already in favorites'
      });
    }
    
    // Add to favorites
    await user.addFavorite(parseInt(kuralNumber));
    
    // Update Kural favorites count
    await Kural.findOneAndUpdate(
      { number: parseInt(kuralNumber) },
      { $inc: { 'metadata.favorites_count': 1 } }
    );
    
    res.json({
      success: true,
      message: 'Kural added to favorites',
      data: {
        kuralNumber: parseInt(kuralNumber),
        totalFavorites: user.activity.favoriteKurals.length + 1
      }
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to favorites'
    });
  }
});

// DELETE /api/users/favorites/:kuralNumber - Remove Kural from favorites
router.delete('/favorites/:kuralNumber', authenticateToken, async (req, res) => {
  try {
    const { kuralNumber } = req.params;
    const user = req.user;
    
    if (isNaN(kuralNumber) || kuralNumber < 1 || kuralNumber > 1330) {
      return res.status(400).json({
        success: false,
        error: 'Valid Kural number is required'
      });
    }
    
    // Check if in favorites
    const existingFavorite = user.activity.favoriteKurals.find(
      fav => fav.kuralNumber === parseInt(kuralNumber)
    );
    
    if (!existingFavorite) {
      return res.status(404).json({
        success: false,
        error: 'Kural not found in favorites'
      });
    }
    
    // Remove from favorites
    await user.removeFavorite(parseInt(kuralNumber));
    
    // Update Kural favorites count
    await Kural.findOneAndUpdate(
      { number: parseInt(kuralNumber) },
      { $inc: { 'metadata.favorites_count': -1 } }
    );
    
    res.json({
      success: true,
      message: 'Kural removed from favorites',
      data: {
        kuralNumber: parseInt(kuralNumber),
        totalFavorites: user.activity.favoriteKurals.length - 1
      }
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from favorites'
    });
  }
});

// GET /api/users/favorites - Get user's favorite Kurals
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get favorite Kural numbers
    const favoriteNumbers = user.activity.favoriteKurals
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(skip, skip + parseInt(limit))
      .map(fav => fav.kuralNumber);
    
    // Get the actual Kurals
    const favoriteKurals = await Kural.find({
      number: { $in: favoriteNumbers }
    }).select('-__v');
    
    // Sort by the order in favorites array
    const sortedKurals = favoriteNumbers.map(num => 
      favoriteKurals.find(kural => kural.number === num)
    ).filter(Boolean);
    
    const total = user.activity.favoriteKurals.length;
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      success: true,
      data: sortedKurals,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites'
    });
  }
});

// POST /api/users/comments - Add comment to a Kural
router.post('/comments', authenticateToken, async (req, res) => {
  try {
    const { kuralNumber, content, language = 'english' } = req.body;
    const user = req.user;
    
    if (!kuralNumber || isNaN(kuralNumber) || kuralNumber < 1 || kuralNumber > 1330) {
      return res.status(400).json({
        success: false,
        error: 'Valid Kural number (1-1330) is required'
      });
    }
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Comment must be less than 1000 characters'
      });
    }
    
    // Check if Kural exists
    const kural = await Kural.findOne({ number: parseInt(kuralNumber) });
    if (!kural) {
      return res.status(404).json({
        success: false,
        error: 'Kural not found'
      });
    }
    
    // Create comment
    const comment = new Comment({
      kuralNumber: parseInt(kuralNumber),
      user: user._id,
      content: content.trim(),
      language,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    
    await comment.save();
    
    // Populate user data
    await comment.populate('user', 'username profile.firstName profile.lastName profile.avatar');
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment'
    });
  }
});

// GET /api/users/comments - Get user's comments
router.get('/comments', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;
    
    const comments = await Comment.getUserComments(user._id, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    const total = await Comment.countDocuments({ 
      user: user._id, 
      status: 'active' 
    });
    
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments'
    });
  }
});

// PUT /api/users/comments/:commentId - Edit user's comment
router.put('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const user = req.user;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Comment must be less than 1000 characters'
      });
    }
    
    // Find comment
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check ownership
    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own comments'
      });
    }
    
    // Edit comment
    await comment.editContent(content.trim());
    
    // Populate user data
    await comment.populate('user', 'username profile.firstName profile.lastName profile.avatar');
    
    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
  } catch (error) {
    console.error('Edit comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to edit comment'
    });
  }
});

// DELETE /api/users/comments/:commentId - Delete user's comment
router.delete('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    
    // Find comment
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check ownership or admin role
    if (comment.user.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own comments'
      });
    }
    
    // Soft delete
    comment.status = 'deleted';
    await comment.save();
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete comment'
    });
  }
});

// POST /api/users/read-kural - Mark Kural as read
router.post('/read-kural', authenticateToken, async (req, res) => {
  try {
    const { kuralNumber } = req.body;
    const user = req.user;
    
    if (!kuralNumber || isNaN(kuralNumber) || kuralNumber < 1 || kuralNumber > 1330) {
      return res.status(400).json({
        success: false,
        error: 'Valid Kural number (1-1330) is required'
      });
    }
    
    // Check if Kural exists
    const kural = await Kural.findOne({ number: parseInt(kuralNumber) });
    if (!kural) {
      return res.status(404).json({
        success: false,
        error: 'Kural not found'
      });
    }
    
    // Mark as read
    await user.markKuralAsRead(parseInt(kuralNumber));
    
    res.json({
      success: true,
      message: 'Kural marked as read',
      data: {
        kuralNumber: parseInt(kuralNumber),
        totalReadKurals: user.activity.readKurals.length
      }
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark Kural as read'
    });
  }
});

// GET /api/users/stats - Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    const stats = {
      totalFavorites: user.activity.favoriteKurals.length,
      totalReadKurals: user.activity.readKurals.length,
      totalComments: await Comment.countDocuments({ 
        user: user._id, 
        status: 'active' 
      }),
      loginCount: user.activity.loginCount,
      memberSince: user.createdAt,
      lastLogin: user.activity.lastLogin,
      readingProgress: {
        aram: user.activity.readKurals.filter(r => {
          // This would need actual Kural data to determine paal
          return r.kuralNumber <= 380; // Approximate range for Aram
        }).length,
        porul: user.activity.readKurals.filter(r => {
          return r.kuralNumber > 380 && r.kuralNumber <= 1080;
        }).length,
        inbam: user.activity.readKurals.filter(r => {
          return r.kuralNumber > 1080;
        }).length
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics'
    });
  }
});

export default router;
