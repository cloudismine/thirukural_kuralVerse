import express from 'express';
import User from '../models/User.js';
import { generateToken, authenticateToken, rateLimit } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for auth routes
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later'
});

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      preferredLanguage = 'english'
    } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmailOrUsername(email) || 
                         await User.findByEmailOrUsername(username);
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      profile: {
        firstName,
        lastName,
        preferredLanguage
      }
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Update login activity
    await user.updateLastLogin();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email/username and password are required'
      });
    }
    
    // Find user by email or username
    const user = await User.findByEmailOrUsername(identifier);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Update login activity
    await user.updateLastLogin();
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences,
          activity: {
            lastLogin: user.activity.lastLogin,
            loginCount: user.activity.loginCount,
            favoriteCount: user.favoriteCount
          }
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// GET /api/auth/profile - Get user profile (requires authentication)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences,
          activity: {
            lastLogin: user.activity.lastLogin,
            loginCount: user.activity.loginCount,
            favoriteCount: user.favoriteCount,
            readKuralsCount: user.activity.readKurals.length
          },
          isVerified: user.isVerified,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const {
      firstName,
      lastName,
      bio,
      preferredLanguage,
      dailyKuralNotification,
      emailNotifications,
      theme
    } = req.body;
    
    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (bio !== undefined) user.profile.bio = bio;
    if (preferredLanguage !== undefined) user.profile.preferredLanguage = preferredLanguage;
    
    // Update preferences
    if (dailyKuralNotification !== undefined) {
      user.preferences.dailyKuralNotification = dailyKuralNotification;
    }
    if (emailNotifications !== undefined) {
      user.preferences.emailNotifications = emailNotifications;
    }
    if (theme !== undefined) user.preferences.theme = theme;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences
        }
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// POST /api/auth/change-password - Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

// DELETE /api/auth/account - Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required to delete account'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Incorrect password'
      });
    }
    
    // Soft delete - deactivate account instead of hard delete
    user.isActive = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
});

export default router;
