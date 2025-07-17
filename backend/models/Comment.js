import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  // Reference to the Kural
  kuralNumber: {
    type: Number,
    required: true,
    ref: 'Kural',
    index: true
  },
  
  // Reference to the user who made the comment
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  
  // Comment content
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },
  
  // Comment language
  language: {
    type: String,
    enum: ['tamil', 'english'],
    default: 'english'
  },
  
  // Comment status
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  },
  
  // Moderation
  isModerated: {
    type: Boolean,
    default: false
  },
  
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  moderatedAt: {
    type: Date,
    default: null
  },
  
  // Engagement
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Reply system (optional - for nested comments)
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    editedAt: Date,
    editCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
commentSchema.index({ kuralNumber: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });
commentSchema.index({ status: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Virtual to check if comment is edited
commentSchema.virtual('isEdited').get(function() {
  return this.metadata.editCount > 0;
});

// Instance method to add like
commentSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(
    like => like.user.toString() === userId.toString()
  );
  
  if (!existingLike) {
    this.likes.push({
      user: userId,
      likedAt: new Date()
    });
  }
  
  return this.save();
};

// Instance method to remove like
commentSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(
    like => like.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Instance method to edit comment
commentSchema.methods.editContent = function(newContent) {
  this.content = newContent;
  this.metadata.editedAt = new Date();
  this.metadata.editCount += 1;
  
  return this.save();
};

// Instance method to add reply
commentSchema.methods.addReply = function(replyId) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId);
  }
  
  return this.save();
};

// Static method to get comments for a Kural
commentSchema.statics.getKuralComments = async function(kuralNumber, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = -1,
    includeReplies = true
  } = options;
  
  const skip = (page - 1) * limit;
  
  let query = {
    kuralNumber,
    status: 'active',
    parentComment: null // Only top-level comments
  };
  
  const comments = await this.find(query)
    .populate('user', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
  
  if (includeReplies) {
    // Populate replies for each comment
    for (let comment of comments) {
      await comment.populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'username profile.firstName profile.lastName profile.avatar'
        },
        match: { status: 'active' },
        options: { sort: { createdAt: 1 } }
      });
    }
  }
  
  return comments;
};

// Static method to get user's comments
commentSchema.statics.getUserComments = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    status = 'active'
  } = options;
  
  const skip = (page - 1) * limit;
  
  return this.find({ user: userId, status })
    .populate('kuralNumber', 'number line1 line2')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Pre-save middleware to update Kural comment count
commentSchema.post('save', async function() {
  if (this.isNew && this.status === 'active') {
    await mongoose.model('Kural').findOneAndUpdate(
      { number: this.kuralNumber },
      { $inc: { 'metadata.comments_count': 1 } }
    );
  }
});

// Pre-remove middleware to update Kural comment count
commentSchema.pre('remove', async function() {
  if (this.status === 'active') {
    await mongoose.model('Kural').findOneAndUpdate(
      { number: this.kuralNumber },
      { $inc: { 'metadata.comments_count': -1 } }
    );
  }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
