import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Middleware to optionally authenticate token (for features that work with or without auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

// Middleware to check if user has specific role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Middleware to check if user is admin
export const requireAdmin = requireRole(['admin']);

// Middleware to check if user is moderator or admin
export const requireModerator = requireRole(['moderator', 'admin']);

// Middleware to validate user ownership or admin access
export const requireOwnershipOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      // Admin can access anything
      if (req.user.role === 'admin') {
        return next();
      }
      
      // Get the user ID of the resource owner
      const resourceUserId = await getResourceUserId(req);
      
      if (!resourceUserId) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
      }
      
      // Check if user owns the resource
      if (req.user._id.toString() !== resourceUserId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied - you can only access your own resources'
        });
      }
      
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        error: 'Authorization check failed'
      });
    }
  };
};

// Rate limiting middleware (simple implementation)
const rateLimitStore = new Map();

export const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = 'Too many requests, please try again later'
  } = options;
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now - data.resetTime > windowMs) {
        rateLimitStore.delete(ip);
      }
    }
    
    // Get or create rate limit data for this IP
    let rateLimitData = rateLimitStore.get(key);
    
    if (!rateLimitData) {
      rateLimitData = {
        count: 0,
        resetTime: now
      };
      rateLimitStore.set(key, rateLimitData);
    }
    
    // Reset count if window has passed
    if (now - rateLimitData.resetTime > windowMs) {
      rateLimitData.count = 0;
      rateLimitData.resetTime = now;
    }
    
    // Check if limit exceeded
    if (rateLimitData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((rateLimitData.resetTime + windowMs - now) / 1000)
      });
    }
    
    // Increment count
    rateLimitData.count++;
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': Math.max(0, maxRequests - rateLimitData.count),
      'X-RateLimit-Reset': new Date(rateLimitData.resetTime + windowMs).toISOString()
    });
    
    next();
  };
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
