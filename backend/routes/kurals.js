import express from 'express';
import Kural from '../models/Kural.js';
import Comment from '../models/Comment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/kurals - Get all kurals with pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      paal,
      adhigaram,
      sortBy = 'number',
      sortOrder = 'asc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    
    // Build query
    let query = {};
    if (paal) query.paal = paal;
    if (adhigaram) query.adhigaram = adhigaram;
    
    // Get kurals
    const kurals = await Kural.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    // Get total count for pagination
    const total = await Kural.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      success: true,
      data: kurals,
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
    console.error('Error fetching kurals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch kurals'
    });
  }
});

// GET /api/kurals/random - Get random kural (Kural of the Day)
router.get('/random', async (req, res) => {
  try {
    const randomKural = await Kural.getRandomKural();
    
    if (!randomKural) {
      return res.status(404).json({
        success: false,
        error: 'No kurals found'
      });
    }
    
    res.json({
      success: true,
      data: randomKural
    });
  } catch (error) {
    console.error('Error fetching random kural:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random kural'
    });
  }
});

// GET /api/kurals/search/:query - Search kurals
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const {
      page = 1,
      limit = 10,
      paal,
      adhigaram
    } = req.query;

    // Check if query is a number - if so, redirect to specific kural
    const queryNumber = parseInt(query);
    if (!isNaN(queryNumber) && queryNumber >= 1 && queryNumber <= 1330) {
      const specificKural = await Kural.findOne({ number: queryNumber }).lean();
      if (specificKural) {
        return res.json({
          success: true,
          data: [specificKural],
          searchQuery: query,
          isDirectMatch: true,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: 1,
            hasNextPage: false,
            hasPrevPage: false
          }
        });
      }
    }

    // For string queries, search comprehensively
    const regexQuery = new RegExp(query.trim(), 'i'); // Case-insensitive, supports Tamil
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build comprehensive filter for text search
    const filter = {
      $or: [
        { line1: regexQuery },
        { line2: regexQuery },
        { meaning_ta: regexQuery },
        { meaning_en: regexQuery },
        { adhigaram: regexQuery },
        { paal: regexQuery },
        { commentary_parimel: regexQuery },
        { commentary_karunanidhi: regexQuery },
        { commentary_yogi: regexQuery }
      ]
    };

    if (paal) filter.paal = paal;
    if (adhigaram) filter.adhigaram = adhigaram;

    const results = await Kural.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Kural.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: results,
      searchQuery: query,
      isDirectMatch: false,
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
    console.error('Error searching kurals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search kurals'
    });
  }
});


// GET /api/kurals/paal/:paal - Get kurals by category
router.get('/paal/:paal', async (req, res) => {
  try {
    const { paal } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const validPaals = ['அறம்', 'பொருள்', 'இன்பம்'];
    if (!validPaals.includes(paal)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid paal. Must be one of: அறம், பொருள், இன்பம்'
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const kurals = await Kural.find({ paal })
      .sort({ adhigaram_no: 1, kural_index: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await Kural.countDocuments({ paal });
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      success: true,
      data: kurals,
      paal,
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
    console.error('Error fetching kurals by paal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch kurals by category'
    });
  }
});

// GET /api/kurals/adhigaram/:adhigaram - Get kurals by sub-category
router.get('/adhigaram/:adhigaram', async (req, res) => {
  try {
    const { adhigaram } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const kurals = await Kural.find({ adhigaram })
      .sort({ kural_index: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    if (kurals.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No kurals found for this adhigaram'
      });
    }
    
    const total = await Kural.countDocuments({ adhigaram });
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      success: true,
      data: kurals,
      adhigaram,
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
    console.error('Error fetching kurals by adhigaram:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch kurals by adhigaram'
    });
  }
});

// GET /api/kurals/stats/overview - Get overview statistics
router.get('/stats/overview', async (_, res) => {
  try {
    const totalKurals = await Kural.countDocuments();
    const paalStats = await Kural.aggregate([
      {
        $group: {
          _id: '$paal',
          count: { $sum: 1 },
          totalViews: { $sum: '$metadata.views' }
        }
      }
    ]);

    const topViewedKurals = await Kural.find()
      .sort({ 'metadata.views': -1 })
      .limit(5)
      .select('number line1 line2 metadata.views');

    res.json({
      success: true,
      data: {
        totalKurals,
        paalStats,
        topViewedKurals
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// GET /api/kurals/:number - Get specific kural by number
router.get('/:number', async (req, res) => {
  try {
    const { number } = req.params;

    if (isNaN(number) || number < 1 || number > 1330) {
      return res.status(400).json({
        success: false,
        error: 'Invalid kural number. Must be between 1 and 1330'
      });
    }

    const kural = await Kural.findOne({ number: parseInt(number) }).select('-__v');

    if (!kural) {
      return res.status(404).json({
        success: false,
        error: 'Kural not found'
      });
    }

    // Increment view count
    await kural.incrementViews();

    res.json({
      success: true,
      data: kural
    });
  } catch (error) {
    console.error('Error fetching kural:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch kural'
    });
  }
});

// GET /api/kurals/:number/comments - Get comments for a specific kural
router.get('/:number/comments', async (req, res) => {
  try {
    const { number } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (isNaN(number) || number < 1 || number > 1330) {
      return res.status(400).json({
        success: false,
        error: 'Invalid kural number'
      });
    }

    const comments = await Comment.getKuralComments(parseInt(number), {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    const total = await Comment.countDocuments({
      kuralNumber: parseInt(number),
      status: 'active',
      parentComment: null
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: comments,
      kuralNumber: parseInt(number),
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
    console.error('Error fetching kural comments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments'
    });
  }
});

export default router;
