import mongoose from 'mongoose';

const kuralSchema = new mongoose.Schema({
  // Unique identifier for each Kural (1 to 1330)
  number: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 1330,
    index: true
  },
  
  // Category: அறம் (Aram), பொருள் (Porul), இன்பம் (Inbam)
  paal: {
    type: String,
    required: true,
    enum: ['அறம்', 'பொருள்', 'இன்பம்'],
    index: true
  },
  
  // Numerical index of Adhigaram inside Paal
  adhigaram_no: {
    type: Number,
    required: true,
    min: 1,
    max: 133,
    index: true
  },
  
  // Title of the Adhigaram (sub-topic)
  adhigaram: {
    type: String,
    required: true,
    index: true
  },
  
  // Position (1–10) inside the Adhigaram
  kural_index: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  
  // Original Tamil lines of the Kural
  line1: {
    type: String,
    required: true,
    index: 'text'
  },
  
  line2: {
    type: String,
    required: true,
    index: 'text'
  },
  
  // Romanized version of Tamil lines (optional)
  transliteration: {
    type: String,
    index: 'text'
  },
  
  // Kural meaning in Tamil
  meaning_ta: {
    type: String,
    required: true,
    index: 'text'
  },
  
  // Kural meaning in English
  meaning_en: {
    type: String,
    required: true,
    index: 'text'
  },
  
  // Commentary by Parimelazhagar
  commentary_parimel: {
    type: String,
    required: true,
    index: 'text'
  },
  
  // Optional commentary by Karunanidhi
  commentary_karunanidhi: {
    type: String,
    index: 'text'
  },
  
  // Optional commentary by Yogi
  commentary_yogi: {
    type: String,
    index: 'text'
  },
  
  // Additional metadata
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    favorites_count: {
      type: Number,
      default: 0
    },
    comments_count: {
      type: Number,
      default: 0
    },
    last_viewed: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
kuralSchema.index({ paal: 1, adhigaram_no: 1 });
kuralSchema.index({ adhigaram: 1, kural_index: 1 });
kuralSchema.index({ number: 1 }, { unique: true });

// Text search index for full-text search
kuralSchema.index({
  line1: 'text',
  line2: 'text',
  meaning_ta: 'text',
  meaning_en: 'text',
  commentary_parimel: 'text',
  commentary_karunanidhi: 'text',
  commentary_yogi: 'text',
  transliteration: 'text'
});

// Virtual for full Kural text
kuralSchema.virtual('full_kural').get(function() {
  return `${this.line1}\n${this.line2}`;
});

// Virtual for Paal in English
kuralSchema.virtual('paal_en').get(function() {
  const paalMap = {
    'அறம்': 'Virtue',
    'பொருள்': 'Wealth',
    'இன்பம்': 'Love'
  };
  return paalMap[this.paal] || this.paal;
});

// Static method to get random Kural (for Kural of the Day)
kuralSchema.statics.getRandomKural = async function() {
  const count = await this.countDocuments();
  const random = Math.floor(Math.random() * count);
  return this.findOne().skip(random);
};

// Static method to search Kurals
kuralSchema.statics.searchKurals = async function(query, options = {}) {
  const {
    page = 1,
    limit = 10,
    paal = null,
    adhigaram = null
  } = options;
  
  let searchQuery = {};
  
  // If query is a number, search by Kural number
  if (!isNaN(query)) {
    searchQuery.number = parseInt(query);
  } else {
    // Text search
    searchQuery.$text = { $search: query };
  }
  
  // Add filters
  if (paal) searchQuery.paal = paal;
  if (adhigaram) searchQuery.adhigaram = adhigaram;
  
  const skip = (page - 1) * limit;
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, number: 1 })
    .skip(skip)
    .limit(limit);
};

// Instance method to increment view count
kuralSchema.methods.incrementViews = function() {
  this.metadata.views += 1;
  this.metadata.last_viewed = new Date();
  return this.save();
};

const Kural = mongoose.model('Kural', kuralSchema);

export default Kural;
