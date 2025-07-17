import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Kural from '../models/Kural.js';
import { rateLimit, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini AI
let genAI = null;
const initializeGeminiAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// Rate limiting
const chatRateLimit = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Too many chat requests, please try again later'
});

const THIRUVALLUVAR_SYSTEM_PROMPT = `
You are Thiruvalluvar, the great Tamil poet and philosopher who wrote the Thirukkural around 2000 years ago. You are wise, compassionate, and speak with the authority of ancient wisdom.

Your personality:
- Wise and patient teacher
- Speaks with gentle authority
- Provides practical wisdom for modern life
- References specific Kurals when relevant
- Responds in the language requested by the user (Tamil or English)
- Keeps responses concise but meaningful

You help people understand:
- Moral and ethical living (Aram)
- Righteous governance and prosperity (Porul)
- Love, relationships, and human emotions (Inbam)
- How ancient wisdom applies to modern challenges
`;

const getRelevantKurals = async (topic) => {
  try {
    let searchResults = await Kural.searchKurals(topic, { limit: 3 });

    if (!searchResults || searchResults.length < 1) {
      const aiService = initializeGeminiAI();
      if (!aiService) return [];

      const model = aiService.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const prompt = `
You are a wise assistant familiar with all 1330 Kurals of Thirukkural.
Given the user message below, suggest 2 to 3 relevant Kural numbers (between 1 to 1330) that closely match the theme or moral inquiry.

User question: "${topic}"

Respond ONLY with comma-separated numbers. For example: 151, 157, 305
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const kuralNumbersText = response.text().trim();

      const numbers = kuralNumbersText
        .split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n) && n >= 1 && n <= 1330);

      if (numbers.length > 0) {
        const kuralsFromAI = await Kural.find({ number: { $in: numbers } });
        return kuralsFromAI;
      }
    }

    return searchResults;
  } catch (error) {
    console.error('Error finding relevant kurals (AI fallback):', error);
    return [];
  }
};

const formatKuralForAI = (kural) => `
Kural ${kural.number} (${kural.adhigaram}):
Tamil: ${kural.line1} ${kural.line2}
English: ${kural.meaning_en}
Commentary: ${kural.commentary_parimel}
`;

const getFallbackResponse = (language) => {
  const fallbackResponses = {
    tamil: 'வணக்கம்! நான் திருவள்ளுவர். AI சேவை தற்போது கிடைக்கவில்லை. தயவுசெய்து பின்னர் முயற்சிக்கவும்.',
    english: 'Greetings! I am Thiruvalluvar. AI service is currently unavailable. Please try again later.'
  };
  return fallbackResponses[language] || fallbackResponses.english;
};

const getFallbackKuralExplanation = (kural) => `
**குறள் ${kural.number} - ${kural.adhigaram}**

**குறள்:**
${kural.line1}
${kural.line2}

**தமிழ் பொருள்:** ${kural.meaning_ta}

**English Meaning:** ${kural.meaning_en}

**Commentary:** ${kural.commentary_parimel || 'This kural teaches us...'}

**Life Application:** This kural from the ${kural.paal} section provides timeless wisdom...
`;

// POST /api/chat/gemini - Chat with Thiruvalluvar AI
router.post('/gemini', chatRateLimit, optionalAuth, async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'english' } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    // Initialize Gemini AI
    const aiService = initializeGeminiAI();

    // Check if Gemini AI is configured, if not provide fallback
    if (!aiService) {
      // Fallback response when API key is not available
      const fallbackResponse = getFallbackResponse(message, language);
      return res.json({
        success: true,
        response: fallbackResponse,
        isAI: false,
        message: language === 'tamil'
          ? 'AI சேவை தற்போது கிடைக்கவில்லை. இது ஒரு முன்னிர்ணயிக்கப்பட்ட பதில்.'
          : 'AI service is currently unavailable. This is a fallback response.'
      });
    }
    
    // Get the generative model
    const model = aiService.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    // Search for relevant Kurals based on the user's message
    const relevantKurals = await getRelevantKurals(message);
    
    // Build context with relevant Kurals
    let kuralContext = '';
    if (relevantKurals.length > 0) {
      kuralContext = '\n\nRelevant Kurals for context:\n' + 
        relevantKurals.map(formatKuralForAI).join('\n');
    }
    
    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nPrevious conversation:\n' + 
        conversationHistory.slice(-6).map(msg => 
          `${msg.role === 'user' ? 'User' : 'Thiruvalluvar'}: ${msg.content}`
        ).join('\n');
    }
    
    // Construct the full prompt
    const languageInstruction = language === 'tamil'
      ? 'IMPORTANT: You must respond ONLY in Tamil language.'
      : 'IMPORTANT: You must respond ONLY in English language.';

    const fullPrompt = `
${THIRUVALLUVAR_SYSTEM_PROMPT}

${languageInstruction}

Instructions:
- Your response must be limited to 2-3 sentences only.
- When suggesting a specific Kural, use the format "திருக்குறள் [number]" (e.g., "திருக்குறள் 131") for Tamil or "Thirukkural [number]" (e.g., "Thirukkural 131") for English.
- Include exactly ONE kural suggestion when relevant.
- The kural number must be between 1 and 1330.

${kuralContext}
${conversationContext}

User's message: ${message}

Respond concisely with wisdom, as Thiruvalluvar. ${languageInstruction}
`;

    
    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let aiResponse = response.text();

    // Post-process to convert various kural reference formats to "குறள்-[number]" format
    // Convert "திருக்குறள் 131" to "குறள்-131"
    aiResponse = aiResponse.replace(/திருக்குறள்\s+(\d+)/gi, 'குறள்-$1');
    // Convert "Thirukkural 131" to "குறள்-131"
    aiResponse = aiResponse.replace(/Thirukkural\s+(\d+)/gi, 'குறள்-$1');
    // Convert legacy "Kural 131" to "குறள்-131"
    aiResponse = aiResponse.replace(/\bKural\s+(\d+)\b/gi, 'குறள்-$1');
    
    // Suggest a random Kural if none were found relevant
    let suggestedKural = null;
    if (relevantKurals.length === 0) {
      suggestedKural = await Kural.getRandomKural();
    } else {
      suggestedKural = relevantKurals[0];
    }
    
    res.json({
      success: true,
      data: {
        response: aiResponse,
        suggestedKural: suggestedKural ? {
          number: suggestedKural.number,
          line1: suggestedKural.line1,
          line2: suggestedKural.line2,
          meaning_en: suggestedKural.meaning_en,
          adhigaram: suggestedKural.adhigaram
        } : null,
        relevantKurals: relevantKurals.map(k => ({
          number: k.number,
          line1: k.line1,
          line2: k.line2,
          meaning_en: k.meaning_en,
          adhigaram: k.adhigaram
        })),
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Gemini chat error:', error);
    
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'AI service configuration error'
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({
        success: false,
        error: 'AI service temporarily unavailable due to quota limits'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response'
    });
  }
});

// POST /api/chat/kural-explanation - Get AI explanation of a specific Kural
router.post('/kural-explanation', chatRateLimit, optionalAuth, async (req, res) => {
  try {
    const { kuralNumber, context = '', language = 'english' } = req.body;
    
    if (!kuralNumber || isNaN(kuralNumber) || kuralNumber < 1 || kuralNumber > 1330) {
      return res.status(400).json({
        success: false,
        error: 'Valid Kural number (1-1330) is required'
      });
    }
    
    // Get the specific Kural
    const kural = await Kural.findOne({ number: parseInt(kuralNumber) });
    
    if (!kural) {
      return res.status(404).json({
        success: false,
        error: 'Kural not found'
      });
    }

    // Initialize Gemini AI
    const aiService = initializeGeminiAI();

    // Check if AI is available, if not provide fallback explanation
    if (!aiService) {
      const fallbackExplanation = getFallbackKuralExplanation(kural);
      return res.json({
        success: true,
        explanation: fallbackExplanation,
        kural: kural,
        isAI: false,
        message: 'AI service is currently unavailable. This is a basic explanation.'
      });
    }

    const model = aiService.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    const explanationPrompt = `
As Thiruvalluvar, please explain this Kural in detail in ${language === 'tamil' ? 'Tamil language' : 'English language'}:

${formatKuralForAI(kural)}

${context ? `User's specific question/context: ${context}` : ''}

Please provide:
1. A detailed explanation of the meaning
2. The practical wisdom it offers
3. How it applies to modern life
4. Any relevant examples or analogies

Speak as the wise sage Thiruvalluvar, making this ancient wisdom accessible and relevant. Respond in ${language === 'tamil' ? 'Tamil' : 'English'}.
`;
    
    const result = await model.generateContent(explanationPrompt);
    const response = await result.response;
    const explanation = response.text();
    
    res.json({
      success: true,
      data: {
        kural: {
          number: kural.number,
          line1: kural.line1,
          line2: kural.line2,
          meaning_ta: kural.meaning_ta,
          meaning_en: kural.meaning_en,
          adhigaram: kural.adhigaram,
          paal: kural.paal
        },
        explanation,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Kural explanation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate explanation'
    });
  }
});

// GET /api/chat/wisdom-topics - Get suggested topics for wisdom seeking
router.get('/wisdom-topics', async (_, res) => {
  try {
    const topics = [
      {
        category: 'Virtue (அறம்)',
        topics: [
          'How to live ethically',
          'Building good character',
          'Practicing compassion',
          'Dealing with anger',
          'Importance of truthfulness'
        ]
      },
      {
        category: 'Wealth (பொருள்)',
        topics: [
          'Managing money wisely',
          'Building a career',
          'Leadership principles',
          'Dealing with poverty',
          'Creating prosperity'
        ]
      },
      {
        category: 'Love (இன்பம்)',
        topics: [
          'Understanding true love',
          'Building relationships',
          'Dealing with heartbreak',
          'Marriage and partnership',
          'Family harmony'
        ]
      },
      {
        category: 'General Wisdom',
        topics: [
          'Finding life purpose',
          'Overcoming challenges',
          'Making difficult decisions',
          'Building inner peace',
          'Dealing with loss'
        ]
      }
    ];
    
    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Error fetching wisdom topics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wisdom topics'
    });
  }
});

export default router;