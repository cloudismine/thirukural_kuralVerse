import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { chatAPI, kuralAPI } from '../services/api';
import ThiruvalluvarImage from '../components/ThiruvalluvarImage';
import {
  Send,
  Sparkles,
  BookOpen,
  MessageCircle,
  User,
  Bot,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wisdomTopics, setWisdomTopics] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { isTamil } = useTheme();

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: isTamil
          ? 'வணக்கம்! நான் திருவள்ளுவர். உங்கள் வாழ்க்கையில் ஏதேனும் கேள்விகள் அல்லது சந்தேகங்கள் இருந்தால், தயங்காமல் கேளுங்கள். திருக்குறளின் ஞானத்தின் மூலம் உங்களுக்கு வழிகாட்ட நான் இங்கே இருக்கிறேன்.'
          : 'Greetings! I am Thiruvalluvar. If you have any questions or doubts in your life, feel free to ask. I am here to guide you through the wisdom of Thirukkural.',
        timestamp: new Date(),
      }
    ]);

    // Fetch wisdom topics
    fetchWisdomTopics();
  }, [isTamil]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchWisdomTopics = async () => {
    try {
      const response = await chatAPI.getWisdomTopics();
      setWisdomTopics(response.data.data);
    } catch (err) {
      console.error('Failed to fetch wisdom topics:', err);
    }
  };

  // Check if user is at bottom of chat
  const checkIfAtBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const threshold = 100; // pixels from bottom
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold);
    }
  };

  const scrollToBottom = () => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-scroll when new messages arrive (only if user was at bottom)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to detect and parse kural references from AI response
  const parseKuralReferences = async (text) => {
    if (!text || typeof text !== 'string') return [];

    // Multiple regex patterns to catch different kural reference formats
    const patterns = [
      /குறள்-(\d+)/gi,           // குறள்-131
      /குறள்\s*(\d+)/gi,         // குறள் 131
      /kural-(\d+)/gi,           // kural-131 (legacy)
      /kural\s+(\d+)/gi,         // kural 131
      /thirukkural\s+(\d+)/gi    // thirukkural 131
    ];

    const allMatches = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        allMatches.push(...matches);
      }
    });

    if (allMatches.length === 0) {
      return [];
    }

    // Extract unique kural numbers from all matches
    const kuralNumbers = [...new Set(allMatches.map(match => {
      // Extract number from various formats
      const numberMatch = match.match(/(\d+)/);
      if (numberMatch) {
        const number = parseInt(numberMatch[1]);
        return number >= 1 && number <= 1330 ? number : null;
      }
      return null;
    }).filter(Boolean))];

    // Fetch kural data for each number with better error handling
    const detectedKurals = [];
    const fetchPromises = kuralNumbers.map(async (number) => {
      try {
        const response = await kuralAPI.getKural(number);
        if (response.data.success && response.data.data) {
          return {
            number: response.data.data.number,
            line1: response.data.data.line1,
            line2: response.data.data.line2,
            meaning_ta: response.data.data.meaning_ta,
            meaning_en: response.data.data.meaning_en,
            adhigaram: response.data.data.adhigaram,
            paal: response.data.data.paal
          };
        }
      } catch (error) {
        console.error(`Failed to fetch kural ${number}:`, error);
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    return results.filter(Boolean); // Remove null values
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      // Get conversation history (last 6 messages)
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const language = isTamil ? 'tamil' : 'english';
      const response = await chatAPI.chatWithAI(messageText.trim(), conversationHistory, language);

      // Handle both AI and fallback responses
      const responseData = response.data.data || response.data; // Handle nested structure

      const aiResponse = responseData.response;
      const isAI = responseData.isAI !== false; // Default to true if not specified
      const fallbackMessage = responseData.message;
      const relevantKurals = responseData.relevantKurals;

      // Parse kural references from AI response
      const detectedKurals = await parseKuralReferences(aiResponse);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        relevantKurals,
        detectedKurals, // Add detected kurals from AI response
        isAI,
        fallbackMessage
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get response');

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: isTamil
          ? 'மன்னிக்கவும், தற்போது என்னால் பதிலளிக்க முடியவில்லை. தயவுசெய்து பின்னர் முயற்சிக்கவும்.'
          : 'I apologize, I cannot respond right now. Please try again later.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleTopicClick = (topic) => {
    sendMessage(topic);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: isTamil
          ? 'வணக்கம்! நான் திருவள்ளுவர். உங்கள் வாழ்க்கையில் ஏதேனும் கேள்விகள் அல்லது சந்தேகங்கள் இருந்தால், தயங்காமல் கேளுங்கள்.'
          : 'Greetings! I am Thiruvalluvar. If you have any questions or doubts in your life, feel free to ask.',
        timestamp: new Date(),
      }
    ]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-manuscript-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-saffron-600 rounded-full flex items-center justify-center mr-4 border-2 border-saffron-700 shadow-lg">
              <span className="text-white font-bold text-2xl font-catamaran-bold">வள்</span>
            </div>
            <div>
              <h1 className={`text-4xl font-bold text-tamil-800 font-catamaran-bold ${isTamil ? 'font-catamaran-bold' : 'font-catamaran-bold'}`}>
                {isTamil ? 'திருவள்ளுவருடன் உரையாடல்' : 'Chat with Thiruvalluvar'}
              </h1>
              <p className={`text-sandalwood-600 font-catamaran ${isTamil ? 'font-catamaran' : 'font-catamaran'}`}>
                {isTamil
                  ? 'திருக்குறளின் ஞானத்துடன் வாழ்க்கை வழிகாட்டுதல் பெறுங்கள்'
                  : 'Get life guidance with the wisdom of Thirukkural'
                }
              </p>
            </div>
          </div>
          <div className="tamil-divider"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-manuscript-50 border-2 border-sandalwood-500 rounded-lg h-[600px] flex flex-col shadow-lg">
              {/* Chat Header */}
              <div className="border-b border-sandalwood-500 bg-sandalwood-100 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-saffron-600 rounded-full flex items-center justify-center mr-3 border border-saffron-700 shadow-md">
                      <span className="text-white font-bold text-sm font-catamaran-bold">வள்</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-tamil-800 font-catamaran-semibold">
                        {isTamil ? 'ஞான உரையாடல்' : 'Wisdom Chat'}
                      </h3>
                      <div className="text-xs text-sandalwood-600 font-catamaran">
                        {isTamil ? 'திருவள்ளுவருடன்' : 'with Thiruvalluvar'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={clearChat}
                    className="px-3 py-2 text-sm text-sandalwood-600 hover:text-tamil-800 hover:bg-manuscript-100 rounded-md transition-all duration-200 border border-transparent hover:border-sandalwood-300 font-catamaran"
                    title={isTamil ? 'உரையாடலை அழி' : 'Clear chat'}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                onScroll={checkIfAtBottom}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0522d' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isTamil={isTamil}
                  />
                ))}

                {loading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-saffron-600 rounded-full flex items-center justify-center border border-saffron-700 shadow-md">
                      <span className="text-white font-bold text-sm font-catamaran-bold">வள்</span>
                    </div>
                    <div className="chat-bubble-ai p-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-saffron-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-saffron-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-saffron-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-sandalwood-600 font-catamaran">
                          {isTamil ? 'சிந்திக்கிறேன்...' : 'Thinking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-sandalwood-500 bg-sandalwood-100 p-4">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={isTamil
                        ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...'
                        : 'Type your question here...'
                      }
                      className="w-full px-4 py-3 pr-12 border-2 border-sandalwood-300 rounded-md bg-manuscript-50 text-tamil-800 placeholder-sandalwood-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent font-catamaran"
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <MessageCircle className="w-4 h-4 text-sandalwood-500" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !inputMessage.trim()}
                    className="px-4 py-3 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg font-catamaran-medium"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {error && (
                  <div className="mt-2 text-sm text-red-600 font-catamaran">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Topics */}
            <div className="bg-manuscript-50 border-2 border-sandalwood-300 rounded-lg shadow-sm">
              <div className="border-b border-sandalwood-300 bg-sandalwood-100 p-4">
                <h3 className="font-semibold text-tamil-800 flex items-center font-catamaran-semibold">
                  <div className="w-6 h-6 bg-saffron-600 rounded-full flex items-center justify-center mr-2">
                    <Lightbulb className="w-3 h-3 text-white" />
                  </div>
                  {isTamil ? 'ஞான தலைப்புகள்' : 'Wisdom Topics'}
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {wisdomTopics.slice(0, 2).map((category, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-sm mb-2 text-sandalwood-600 font-catamaran-medium">{category.category}</h4>
                      <div className="space-y-1">
                        {category.topics.slice(0, 3).map((topic, topicIndex) => (
                          <button
                            key={topicIndex}
                            onClick={() => handleTopicClick(topic)}
                            className="block w-full text-left text-xs p-2 rounded-md hover:bg-manuscript-100 transition-all duration-200 border border-transparent hover:border-sandalwood-300 hover:shadow-sm text-tamil-700 font-catamaran"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="card-heritage transition-all duration-300 animate-slide-up">
              <div className="card-header bg-gradient-to-r from-temple-50 via-temple-100 to-temple-50 border-b border-temple-200/30">
                <h3 className="card-title flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-2">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  {isTamil ? 'மாதிரி கேள்விகள்' : 'Sample Questions'}
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-2">
                  {[
                    isTamil ? 'நல்ல வாழ்க்கை எப்படி வாழ்வது?' : 'How to live a good life?',
                    isTamil ? 'கோபத்தை எப்படி கட்டுப்படுத்துவது?' : 'How to control anger?',
                    isTamil ? 'உண்மையான நட்பு என்றால் என்ன?' : 'What is true friendship?',
                    isTamil ? 'செல்வத்தை எப்படி சரியாக பயன்படுத்துவது?' : 'How to use wealth properly?'
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleTopicClick(question)}
                      className="block w-full text-left text-xs p-2 rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card">
              <div className="card-content text-center">
                <Bot className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">
                  {isTamil ? 'AI திருவள்ளுவர்' : 'AI Thiruvalluvar'}
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {isTamil
                    ? 'திருக்குறளின் ஞானத்துடன் இயங்கும் AI உதவியாளர்'
                    : 'AI assistant powered by Thirukkural wisdom'
                  }
                </p>
                <Link to="/about" className="btn-outline btn-sm w-full">
                  {isTamil ? 'மேலும் அறிய' : 'Learn More'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isTamil }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {isUser ? (
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-royal-600 border-2 border-royal-700">
          <User className="w-5 h-5 text-white" />
        </div>
      ) : (
        <ThiruvalluvarImage size="md" style="icon" />
      )}

      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'text-right' : ''}`}>
        <div className={`p-4 shadow-sm transition-all duration-200 hover:shadow-md font-catamaran ${
          isUser
            ? 'chat-bubble-user text-tamil-800'
            : message.isError
              ? 'bg-red-50 text-red-800 border border-red-200 rounded-lg'
              : 'chat-bubble-ai text-tamil-800'
        }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

          {/* Fallback message indicator */}
          {!isUser && message.isAI === false && message.fallbackMessage && (
            <div className="mt-3 pt-3 border-t border-heritage-200/50">
              <div className="flex items-center text-xs text-heritage-700 bg-heritage-50/50 rounded-md p-2">
                <Sparkles className="w-3 h-3 mr-2 text-heritage-600" />
                {message.fallbackMessage}
              </div>
            </div>
          )}
        </div>

        {/* Detected Kurals from AI Response */}
        {message.detectedKurals && message.detectedKurals.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.detectedKurals.map((kural) => (
              <div key={kural.number} className="p-4 bg-gradient-to-r from-heritage-50/90 via-temple-50/60 to-heritage-100/80 rounded-lg border border-heritage-200/50 shadow-sm">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-4 h-4 text-heritage-600 mr-2" />
                  <span className="text-sm font-medium text-heritage-700">
                    {isTamil ? 'AI பரிந்துரைத்த குறள்' : 'AI Suggested Kural'}
                  </span>
                </div>
                <Link
                  to={`/kural/${kural.number}`}
                  className="block hover:bg-heritage-100/60 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-heritage-200/60 hover:shadow-md group cursor-pointer"
                  onClick={() => {
                    console.log(`Navigating to AI suggested Kural ${kural.number}`);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-heritage-800">
                      {isTamil ? 'குறள்' : 'Kural'} {kural.number}
                    </div>
                    <div className="text-xs text-heritage-600 bg-heritage-100/50 px-2 py-1 rounded">
                      {kural.adhigaram}
                    </div>
                  </div>
                  <div className="kural-text text-base text-heritage-800 mb-3 leading-relaxed font-medium anek-tamil-medium">
                    {kural.line1}<br />
                    {kural.line2}
                  </div>
                  <p className="text-sm text-temple-600 leading-relaxed">
                    {isTamil ? kural.meaning_ta || kural.meaning_en : kural.meaning_en}
                  </p>
                  <div className="mt-2 text-xs text-heritage-600 group-hover:text-heritage-700 transition-colors flex items-center">
                    <span>{isTamil ? 'குறளைப் பார்க்க கிளிக் செய்யுங்கள்' : 'Click to view kural'}</span>
                    <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        

        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Chat;
