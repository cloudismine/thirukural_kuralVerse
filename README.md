# KuralVerse - குறள்VERSE 🏛️

A culturally rich, full-stack MERN application presenting the Thirukkural with authentic Tamil design, intelligent AI chat, and modern web technologies. Features a clean, non-vibrant ancient Tamil aesthetic with traditional colors and typography.

## 🌟 Features

### 📚 **Complete Kural Experience**
- **All 1330 Kurals**: Complete collection with Tamil and English meanings
- **Multiple Commentaries**: Parimelazhagar, Karunanidhi, and Yogi scholarly interpretations
- **Category Navigation**: Browse by Paal (அறம் 🪔, பொருள் 👑, இன்பம் ❤️) with cultural icons
- **Two-Column Layout**: Desktop displays kurals in organized two-column grid
- **Ancient Paper Design**: Deep brown borders (#5d4037) with manuscript background

### 🔍 **Enhanced Search Experience**
- **Fixed Search Bar**: Properly aligned with 36px padding and 400px max width
- **Smart Number Search**: Direct navigation to kural numbers (1-1330)
- **Comprehensive Text Search**: Search across Tamil text, English meanings, commentaries
- **Cultural Design**: Retro-style background (#fffaf0) with bordered search boxes
- **Multi-language Support**: Search in both Tamil and English

### 🤖 **AI-Powered Chat with Thiruvalluvar**
- **Interactive Thiruvalluvar**: AI chat using Google Gemini 2.0 Flash Lite
- **Smart Scroll Behavior**: Only auto-scrolls if user is at bottom of chat
- **Palm-Leaf Chat Bubbles**: Authentic design with user messages on right (brown) and AI on left
- **Thiruvalluvar Avatar**: Custom image integration with fallback to வள் icon
- **Background Pattern**: Subtle palm-leaf inspired background texture
- **Automatic Kural Detection**: AI responses automatically display referenced kurals

### 🎨 **Authentic Tamil Design**
- **Catamaran Typography**: Primary font for Tamil elements with multiple weights
- **Cultural Color Palette**:
  - Background: #fdf6e3 (palm leaf ivory)
  - Text: #3e2c2c (deep brown)
  - Accents: #a0522d (sandalwood), #7c3aed (royal purple), #d97706 (saffron)
- **No Animations/Gradients**: Clean, stable design with solid colors
- **Tamil Dividers**: Traditional ornamental dividers with ❋ symbol
- **Cultural Icons**: 🪔 for அறம், 👑 for பொருள், ❤️ for இன்பம்

### 🌓 **Theme & Language Controls**
- **Dark/Light Theme Toggle**: Sun/moon icons with localStorage persistence
- **Language Toggle**: தமிழ் / English switching with proper positioning
- **Dark Theme**: Deep maroon (#2e1a0f) and sandal brown (#4a2c1a) colors
- **Responsive Toggles**: Available in both desktop header and mobile menu

### 👤 **User Features**
- **Lazy Authentication**: Browse freely, login only for personal features
- **Fixed Profile Dropdown**: Proper positioning within viewport boundaries
- **Favorites System**: Save and organize favorite kurals
- **Profile Management**: Personalized settings and preferences

### 🖼️ **Visual Integration**
- **Thiruvalluvar Images**: Integrated throughout Chat, Homepage, and Footer
- **Rounded Borders**: Styled images with proper borders and shadows
- **Fallback System**: Graceful fallback to வள் icon if images fail to load
- **Cultural Placement**: Strategic placement maintaining design harmony

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** with custom Tamil heritage theme and cultural colors
- **Catamaran, Anek Tamil & Noto Sans Tamil** fonts for authentic typography
- **React Router** for client-side navigation
- **Axios** for API communication
- **Lucide React** for modern icons
- **Custom Hooks** for theme, authentication, and dark mode
- **ThiruvalluvarImage Component** for consistent image integration
- **localStorage** for theme and language persistence

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication with lazy loading
- **Google Gemini AI** (2.0 Flash Lite) integration
- **Rate Limiting** and security middleware
- **CORS** enabled for cross-origin requests

### Database
- **MongoDB Atlas** cloud database
- **Indexed Collections** for fast search
- **Structured Documents** with comprehensive kural data
- **User Management** with preferences and favorites

### AI Integration
- **Google Gemini AI** for intelligent conversations
- **Context-Aware Responses** with conversation history
- **Automatic Kural Detection** and display
- **Bilingual Support** (Tamil/English)

## 🎨 Design Principles

### Authentic Tamil Aesthetic
- **Clean, Non-Vibrant Design**: Solid colors without gradients or animations
- **Ancient Manuscript Feel**: Palm leaf ivory backgrounds with deep brown text
- **Cultural Color Harmony**: Sandalwood brown, royal purple, and saffron accents
- **Traditional Typography**: Catamaran font family for Tamil elements

### User Experience Focus
- **Fixed Search Bars**: Proper 36px padding with 400px max width for readability
- **Smart Scroll Behavior**: Chat only auto-scrolls when user is at bottom
- **Responsive Design**: Two-column desktop layout, single column mobile
- **Stable Interface**: No zoom animations, only margin/color hover effects

### Cultural Integration
- **Meaningful Icons**: 🪔 (lamp) for virtue, 👑 (crown) for wealth, ❤️ (heart) for love
- **Tamil Dividers**: Traditional ❋ ornamental separators
- **Thiruvalluvar Imagery**: Consistent avatar integration with fallback system
- **Heritage Colors**: Authentic Tamil manuscript-inspired color palette

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gemini AI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd KuralVerse
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB and Gemini API credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Image Assets Setup**
```bash
# Add Thiruvalluvar image to public folder
mkdir -p frontend/public/images
# Place thiruvalluvar.jpg in frontend/public/images/
# The ThiruvalluvarImage component will automatically use this image
```

5. **Environment Variables**

Backend (.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## 📁 Project Structure

```
KuralVerse/
├── frontend/                 # React application
│   ├── public/
│   │   └── images/          # Thiruvalluvar and cultural images
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Header.jsx   # Enhanced header with theme/language toggles
│   │   │   ├── Footer.jsx   # Redesigned 3-column footer
│   │   │   └── ThiruvalluvarImage.jsx  # Thiruvalluvar image component
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx    # Homepage with cultural design
│   │   │   ├── Chat.jsx    # Enhanced chat with scroll behavior
│   │   │   ├── Search.jsx  # Improved search with fixed bars
│   │   │   └── KuralList.jsx # Two-column kural layout
│   │   ├── hooks/          # Custom hooks
│   │   │   ├── useTheme.js # Language toggle hook
│   │   │   └── useThemeToggle.js # Dark/light theme hook
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/
├── backend/                 # Express API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── controllers/        # Route controllers
│   └── utils/              # Utility functions
└── README.md
```

## 🔗 API Endpoints

### 📚 Kurals API
- `GET /api/kurals` - Get all kurals with pagination and filtering
- `GET /api/kurals/:number` - Get specific kural by number (1-1330)
- `GET /api/kurals/search/:query` - Intelligent search (number or text)
- `GET /api/kurals/paal/:paal` - Get kurals by main category
- `GET /api/kurals/adhigaram/:adhigaram` - Get kurals by chapter
- `GET /api/kurals/random` - Get random kural (Kural of the Day)
- `GET /api/kurals/stats/overview` - Get database statistics

### 🤖 AI Chat API
- `POST /api/chat/gemini` - Chat with Thiruvalluvar AI
- `POST /api/chat/kural-explanation` - Get AI explanation for specific kural
- `GET /api/chat/wisdom-topics` - Get suggested wisdom topics

### 🔐 Authentication API
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### 👤 User Features API
- `POST /api/users/favorites` - Add kural to favorites
- `DELETE /api/users/favorites/:number` - Remove from favorites
- `GET /api/users/favorites` - Get user's favorite kurals
- `POST /api/users/comments` - Add comment to kural
- `GET /api/kurals/:number/comments` - Get comments for kural
- `GET /api/users/stats` - Get user activity statistics

## 🎯 Usage

### 🔍 **Smart Search**
- **Number Search**: Type any number (1-1330) to go directly to that kural
- **Text Search**: Search in Tamil or English across all content
- **Comprehensive Results**: Searches kural text, meanings, and commentaries

### 🤖 **AI Chat Experience**
- **Natural Conversation**: Ask questions about life, ethics, relationships
- **Automatic Kural Display**: AI mentions kurals using "குறள்-131" format
- **Bilingual Support**: Chat in Tamil or English
- **Context Awareness**: AI remembers conversation history

### 📚 **Kural Exploration**
- **Category Browsing**: Navigate by Paal and Adhigaram
- **Multiple Commentaries**: Read scholarly interpretations
- **Heritage Design**: Authentic Tamil typography and colors
- **Responsive Layout**: Perfect on all devices

### 👤 **Personal Features**
- **Lazy Authentication**: No login required for browsing
- **Favorites System**: Save kurals for later reference
- **Comments**: Share insights and thoughts
- **Profile Management**: Customize preferences

## 🔐 Authentication

The app uses a "lazy authentication" approach:
- **No login required**: Browse kurals, use AI chat, read content
- **Login required**: Save favorites, post comments, personalized features

## 🌍 Internationalization

- Tamil interface with proper Unicode support
- English translations and interface
- Romanized transliterations available

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet & Desktop**: Responsive layouts for all screen sizes
- **Touch-Friendly**: Intuitive navigation and interactions
- **Accessibility**: Screen reader support and keyboard navigation
- **Heritage Theme**: Consistent cultural design across devices

## 🚀 Current Status

### ✅ **Completed Features**
- **Complete Kural Database**: All 1330 kurals with commentaries
- **Intelligent Search**: Number-based direct navigation and text search
- **AI Chat Integration**: Google Gemini AI with automatic kural detection
- **Authentic Typography**: Anek Tamil font with proper Tamil rendering
- **Heritage UI Design**: Cultural theme with traditional Tamil colors
- **Responsive Layout**: Mobile, tablet, and desktop optimized
- **User Authentication**: JWT-based lazy authentication system
- **Favorites & Comments**: Personal features for registered users

### 🔄 **In Development**
- **Enhanced AI Responses**: Improved context understanding
- **Advanced Search Filters**: Category and date-based filtering
- **User Dashboard**: Personalized learning progress
- **Offline Support**: PWA capabilities for offline access

### 🎯 **Planned Features**
- **Daily Notifications**: Kural of the day push notifications
- **Social Features**: Share kurals and insights
- **Learning Paths**: Guided study programs
- **Audio Support**: Tamil pronunciation and recitation

## ✨ Recent Improvements (v2.0)

### 🎨 **Design Overhaul**
- **Authentic Tamil Aesthetic**: Complete redesign with cultural colors and typography
- **Removed All Animations**: Clean, stable interface with solid colors only
- **Fixed Search Bars**: Proper alignment with 36px padding and 400px max width
- **Two-Column Layout**: Desktop kurals display in organized grid format
- **Cultural Icons**: Meaningful symbols for each category (🪔👑❤️)

### 🌓 **Enhanced User Experience**
- **Dark/Light Theme Toggle**: Persistent theme switching with localStorage
- **Language Toggle**: Seamless தமிழ் / English switching
- **Smart Chat Scrolling**: Only auto-scrolls when user is at bottom
- **Fixed Profile Dropdown**: Proper viewport positioning
- **Mobile Responsive**: Improved mobile navigation with collapsible menu

### 🖼️ **Visual Integration**
- **Thiruvalluvar Images**: Integrated throughout application with fallback system
- **Palm-Leaf Chat Bubbles**: Authentic message styling
- **Tamil Dividers**: Traditional ornamental separators
- **Heritage Footer**: 3-column layout with cultural elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Thiruvalluvar for the timeless wisdom
- Tamil literary scholars for commentaries
- Google Gemini AI for conversational features
- Open source community for tools and libraries
