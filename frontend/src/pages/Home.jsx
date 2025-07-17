import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { kuralAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ThiruvalluvarImage from '../components/ThiruvalluvarImage';
import {
  Search,
  BookOpen,
  MessageCircle,
  Heart,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [kuralOfTheDay, setKuralOfTheDay] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isTamil } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [kuralResponse, statsResponse] = await Promise.all([
          kuralAPI.getRandomKural(),
          kuralAPI.getStats()
        ]);

        setKuralOfTheDay(kuralResponse.data.data);
        setStats(statsResponse.data.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    {
      name: 'அறம்',
      nameEn: 'Virtue',
      description: isTamil
        ? 'நல்லொழுக்கம், அறநெறி, ஒழுக்கம்'
        : 'Ethics, righteousness, and moral conduct',
      color: 'text-saffron-600',
      bgColor: 'bg-manuscript-50',
      borderColor: 'border-sandalwood-300',
      icon: '🪔'
    },
    {
      name: 'பொருள்',
      nameEn: 'Wealth',
      description: isTamil
        ? 'செல்வம், அரசியல், பொருளாதாரம்'
        : 'Prosperity, governance, and economics',
      color: 'text-royal-600',
      bgColor: 'bg-manuscript-50',
      borderColor: 'border-sandalwood-300',
      icon: '👑'
    },
    {
      name: 'இன்பம்',
      nameEn: 'Love',
      description: isTamil
        ? 'காதல், இன்பம், உறவுகள்'
        : 'Love, pleasure, and relationships',
      color: 'text-sandalwood-600',
      bgColor: 'bg-manuscript-50',
      borderColor: 'border-sandalwood-300',
      icon: '❤️'
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: isTamil ? 'முழுமையான குறள் தொகுப்பு' : 'Complete Kural Collection',
      description: isTamil 
        ? '1330 குறள்கள் தமிழ் மற்றும் ஆங்கில மொழிபெயர்ப்புடன்'
        : 'All 1330 Kurals with Tamil and English translations'
    },
    {
      icon: MessageCircle,
      title: isTamil ? 'AI வள்ளுவர் உரையாடல்' : 'AI Thiruvalluvar Chat',
      description: isTamil 
        ? 'திருவள்ளுவருடன் நேரடியாக உரையாடி ஞானம் பெறுங்கள்'
        : 'Chat directly with Thiruvalluvar AI for wisdom and guidance'
    },
    {
      icon: Heart,
      title: isTamil ? 'தனிப்பட்ட சேகரிப்பு' : 'Personal Collection',
      description: isTamil 
        ? 'விருப்பமான குறள்களை சேமித்து வைத்துக்கொள்ளுங்கள்'
        : 'Save your favorite Kurals and track your reading progress'
    }
  ];

  if (loading) {
    return (
    <div className={`min-h-screen flex items-center justify-center ${isTamil ? 'tamil-font' : ''}`}>
      <LoadingSpinner size="lg" text={isTamil ? 'ஏற்றுகிறது...' : 'Loading...'} />
    </div>
    ); 
  }

  return (
    <div className={`min-h-screen bg-manuscript-50 ${isTamil ? 'font-catamaran' : 'font-catamaran'}`}>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-manuscript-50">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-tamil-800 font-catamaran-bold">
              {isTamil ? 'குறள்VERSE' : 'KuralVerse'}
            </h1>
            <p className="text-xl md:text-2xl text-sandalwood-600 mb-8 font-catamaran">
              {isTamil
                ? 'திருக்குறளின் அழியாத ஞானத்தை நவீன உலகில் கொண்டு வருகிறோம்'
                : 'Bringing the timeless wisdom of Thirukkural to the modern world'
              }
            </p>
            <div className="tamil-divider mb-8"></div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sandalwood-600 w-5 h-5 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isTamil
                    ? 'குறள் எண் அல்லது உள்ளடக்கம் தேடுங்கள்...'
                    : 'Search by Kural number or content...'
                  }
                  className="w-full pr-24 py-4 text-lg rounded-lg border-2 border-sandalwood-500 bg-manuscript-50 text-tamil-800 placeholder-sandalwood-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 shadow-lg font-catamaran"
                  style={{ paddingLeft: '48px', maxWidth: '400px' }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 transition-colors duration-200 font-catamaran-medium shadow-sm"
                >
                  {isTamil ? 'தேடு' : 'Search'}
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/kurals" className="px-6 py-3 bg-sandalwood-500 text-white rounded-lg hover:bg-sandalwood-600 transition-colors duration-200 shadow-md hover:shadow-lg font-catamaran-medium group">
                <BookOpen className="w-5 h-5 mr-2 inline" />
                {isTamil ? 'குறள்களை ஆராயுங்கள்' : 'Explore Kurals'}
              </Link>
              <Link to="/chat" className="px-6 py-3 border-2 border-sandalwood-500 text-sandalwood-600 rounded-lg hover:bg-sandalwood-50 transition-colors duration-200 shadow-md hover:shadow-lg font-catamaran-medium group">
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                {isTamil ? 'வள்ளுவருடன் பேசுங்கள்' : 'Chat with Valluvar'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kural of the Day */}
      {kuralOfTheDay && (
        <section className="py-16 bg-sandalwood-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-saffron-600 mr-2" />
                <h2 className="text-2xl md:text-3xl font-bold text-tamil-800 font-catamaran-bold">
                  {isTamil ? 'இன்றைய குறள்' : 'Kural of the Day'}
                </h2>
              </div>

              <div className="kural-box max-w-2xl mx-auto">
                <div className="text-center p-8">
                  <div className="text-sm text-sandalwood-600 mb-2 font-catamaran">
                    {isTamil ? 'குறள்' : 'Kural'} {kuralOfTheDay.number} - {kuralOfTheDay.adhigaram}
                  </div>
                  <div className="text-2xl mb-4 text-tamil-800 font-catamaran-medium leading-relaxed">
                    {kuralOfTheDay.line1}<br />
                    {kuralOfTheDay.line2}
                  </div>
                  <p className="text-lg mb-4 text-tamil-700 font-catamaran">
                    {isTamil ? kuralOfTheDay.meaning_ta : kuralOfTheDay.meaning_en}
                  </p>
                  <Link
                    to={`/kural/${kuralOfTheDay.number}`}
                    className="inline-flex items-center px-4 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 transition-colors duration-200 font-catamaran-medium"
                  >
                    {isTamil ? 'மேலும் படிக்க' : 'Read More'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories - Thiruvalluvar Image on Left, Paals on Right */}
<section className="py-16 bg-manuscript-50">
  <div className="container mx-auto px-6">
    {/* Section Heading */}
    <h2 className="text-3xl font-bold text-center mb-8 text-tamil-800 font-catamaran-bold">
      {isTamil ? 'பால்கள்' : 'Categories'}
    </h2>
    <div className="tamil-divider mb-12" />

    {/* Two-Column Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">



      {/* Right Column: Paals List */}
      <div className="flex flex-col gap-6 w-full">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/category/${encodeURIComponent(category.name)}`}
            className="group"
          >
            <div className="kural-box hover:shadow-xl transition-all duration-200 bg-manuscript-50 border border-sandalwood-300">
              <div className="flex items-center p-6">
                <div className="w-16 h-16 mr-6 rounded-xl bg-sandalwood-500 flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${category.color} font-catamaran-bold`}>
                    {isTamil ? category.name : category.nameEn}
                  </h3>
                  <p className="text-sandalwood-600 text-sm leading-relaxed font-catamaran mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center text-sm text-saffron-600 group-hover:text-saffron-700 font-catamaran-medium">
                    <span>{isTamil ? 'ஆராயுங்கள்' : 'Explore'}</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

            {/* Left Column: Thiruvalluvar */}
      <div className="flex flex-col items-center justify-center text-center lg:text-right">
        <ThiruvalluvarImage size="2xl" style="portrait" />
        <h3 className="text-2xl font-bold text-tamil-800 mt-4 font-catamaran-bold">
          {isTamil ? 'திருவள்ளுவர்' : 'Thiruvalluvar'}
        </h3>
        <p className="text-sandalwood-600 font-catamaran leading-relaxed max-w-md mt-2">
          {isTamil
            ? 'திருக்குறளின் ஆசிரியர். அறம், பொருள், இன்பம் என்ற மூன்று பால்களில் 1330 குறள்களை இயற்றியவர்.'
            : 'Author of Thirukkural. Composed 1330 kurals across three sections: Virtue, Wealth, and Love.'
          }
        </p>
      </div>

    </div>
  </div>
</section>


      {/* Features */}
      <section className="py-16 bg-sandalwood-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-tamil-800 font-catamaran-bold">
            {isTamil ? 'சிறப்பு அம்சங்கள்' : 'Features'}
          </h2>
          <div className="tamil-divider mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-saffron-600 rounded-full flex items-center justify-center shadow-md">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-tamil-800 font-catamaran-semibold">{feature.title}</h3>
                <p className="text-sandalwood-600 font-catamaran">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="py-16 bg-manuscript-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-saffron-600 mb-2 font-catamaran-bold">
                  {stats.totalKurals}
                </div>
                <div className="text-sandalwood-600 font-catamaran">
                  {isTamil ? 'குறள்கள்' : 'Kurals'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-royal-600 mb-2 font-catamaran-bold">
                  133
                </div>
                <div className="text-sandalwood-600 font-catamaran">
                  {isTamil ? 'அதிகாரங்கள்' : 'Chapters'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sandalwood-600 mb-2 font-catamaran-bold">
                  3
                </div>
                <div className="text-sandalwood-600 font-catamaran">
                  {isTamil ? 'பால்கள்' : 'Sections'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-tamil-800 mb-2 font-catamaran-bold">
                  2000+
                </div>
                <div className="text-sandalwood-600 font-catamaran">
                  {isTamil ? 'ஆண்டுகள்' : 'Years Old'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
