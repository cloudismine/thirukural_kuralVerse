import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic user information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile information
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: 500
    },
    preferredLanguage: {
      type: String,
      enum: ['tamil', 'english'],
      default: 'english'
    }
  },
  
  // User preferences
  preferences: {
    dailyKuralNotification: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  
  // User activity
  activity: {
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loginCount: {
      type: Number,
      default: 0
    },
    favoriteKurals: [{
      kuralNumber: {
        type: Number,
        ref: 'Kural'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    readKurals: [{
      kuralNumber: {
        type: Number,
        ref: 'Kural'
      },
      readAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ 'activity.favoriteKurals.kuralNumber': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.profile && this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username || 'Anonymous';
});

// Virtual for favorite count
userSchema.virtual('favoriteCount').get(function() {
  return this.activity && this.activity.favoriteKurals ? this.activity.favoriteKurals.length : 0;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to add favorite Kural
userSchema.methods.addFavorite = function(kuralNumber) {
  const existingFavorite = this.activity.favoriteKurals.find(
    fav => fav.kuralNumber === kuralNumber
  );
  
  if (!existingFavorite) {
    this.activity.favoriteKurals.push({
      kuralNumber,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Instance method to remove favorite Kural
userSchema.methods.removeFavorite = function(kuralNumber) {
  this.activity.favoriteKurals = this.activity.favoriteKurals.filter(
    fav => fav.kuralNumber !== kuralNumber
  );
  
  return this.save();
};

// Instance method to mark Kural as read
userSchema.methods.markKuralAsRead = function(kuralNumber) {
  const existingRead = this.activity.readKurals.find(
    read => read.kuralNumber === kuralNumber
  );
  
  if (!existingRead) {
    this.activity.readKurals.push({
      kuralNumber,
      readAt: new Date()
    });
    
    // Keep only last 100 read kurals
    if (this.activity.readKurals.length > 100) {
      this.activity.readKurals = this.activity.readKurals
        .sort((a, b) => b.readAt - a.readAt)
        .slice(0, 100);
    }
  }
  
  return this.save();
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.activity.lastLogin = new Date();
  this.activity.loginCount += 1;
  return this.save();
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

const User = mongoose.model('User', userSchema);

export default User;
