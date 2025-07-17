import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import {
  BookOpen,
  User,
  Calendar,
  Globe,
  Heart,
  MessageCircle,
  Sparkles,
  Code
} from 'lucide-react';

const About = () => {
  const { isTamil } = useTheme();

  const sections = [
    {
      id: 'thirukkural',
      title: isTamil ? 'திருக்குறள் பற்றி' : 'About Thirukkural',
      icon: BookOpen,
      content: isTamil ? [
        'திருக்குறள் என்பது தமிழ் இலக்கியத்தின் முத்து. இது திருவள்ளுவர் என்ற மகான் எழுதிய அழியாத நூல்.',
        'இதில் 1330 குறள்கள் உள்ளன, அவை மூன்று பால்களாக பிரிக்கப்பட்டுள்ளன: அறம், பொருள், இன்பம்.',
        'ஒவ்வொரு குறளும் இரண்டு வரிகளில் ஆழமான ஞானத்தை வெளிப்படுத்துகிறது.',
        'இது உலகின் அனைத்து மொழிகளிலும் மொழிபெயர்க்கப்பட்ட தமிழின் பெருமை.'
      ] : [
        'Thirukkural is a pearl of Tamil literature, an immortal work written by the great sage Thiruvalluvar.',
        'It contains 1330 kurals (couplets) divided into three sections: Aram (Virtue), Porul (Wealth), and Inbam (Love).',
        'Each kural expresses profound wisdom in just two lines, making it a masterpiece of concise literature.',
        'It has been translated into numerous languages worldwide, making it a global treasure of wisdom.'
      ]
    },
    {
      id: 'thiruvalluvar',
      title: isTamil ? 'திருவள்ளுவர்' : 'Thiruvalluvar',
      icon: User,
      content: isTamil ? [
        'திருவள்ளுவர் ஒரு தமிழ் கவிஞர் மற்றும் தத்துவஞானி. அவர் கிபி 1-2 ஆம் நூற்றாண்டில் வாழ்ந்ததாக கருதப்படுகிறது.',
        'அவர் சாதி, மத வேறுபாடுகளைக் கடந்து அனைவராலும் மதிக்கப்படும் மகான்.',
        'அவரது மனைவி வாசுகி அவருக்கு பெரும் ஆதரவாக இருந்தார்.',
        'திருவள்ளுவர் உலகளாவிய மனிதநேயத்தின் சின்னமாக விளங்குகிறார்.'
      ] : [
        'Thiruvalluvar was a Tamil poet and philosopher who is believed to have lived in the 1st-2nd century CE.',
        'He is revered by people across all castes and religions as a universal sage.',
        'His wife Vasuki was a great support to him in his literary endeavors.',
        'Thiruvalluvar stands as a symbol of universal humanism and timeless wisdom.'
      ]
    },
    {
      id: 'structure',
      title: isTamil ? 'அமைப்பு' : 'Structure',
      icon: Calendar,
      content: isTamil ? [
        'திருக்குறள் மூன்று பால்களாக பிரிக்கப்பட்டுள்ளது:',
        '• அறத்துப்பால் (380 குறள்கள்) - நல்லொழுக்கம் மற்றும் அறநெறி',
        '• பொருட்பால் (700 குறள்கள்) - செல்வம், அரசியல், பொருளாதாரம்',
        '• காமத்துப்பால் (250 குறள்கள்) - காதல் மற்றும் இன்பம்',
        'ஒவ்வொரு பாலும் பல அதிகாரங்களாக பிரிக்கப்பட்டுள்ளது, மொத்தம் 133 அதிகாரங்கள்.'
      ] : [
        'Thirukkural is divided into three main sections:',
        '• Arathuppal (380 kurals) - Virtue and righteousness',
        '• Porutpal (700 kurals) - Wealth, politics, and economics',
        '• Kamathuppal (250 kurals) - Love and pleasure',
        'Each section is further divided into chapters, totaling 133 chapters (adhigarams).'
      ]
    },
    {
      id: 'commentaries',
      title: isTamil ? 'உரைகள்' : 'Commentaries',
      icon: MessageCircle,
      content: isTamil ? [
        'திருக்குறளுக்கு பல அறிஞர்கள் உரை எழுதியுள்ளனர்:',
        '• பரிமேலழகர் உரை - மிகவும் பிரபலமான உரை',
        '• கலைஞர் கருணாநிதி உரை - நவீன தமிழில் எளிய விளக்கம்',
        '• யோகி உரை - ஆங்கிலத்தில் கவிதை வடிவில்',
        'இந்த உரைகள் குறள்களின் ஆழமான பொருளை புரிந்துகொள்ள உதவுகின்றன.'
      ] : [
        'Several scholars have written commentaries on Thirukkural:',
        '• Parimelazhagar Commentary - The most famous traditional commentary',
        '• Kalaignar Karunanidhi Commentary - Modern Tamil explanation',
        '• Yogi Commentary - Poetic English translation',
        'These commentaries help understand the deeper meanings of the kurals.'
      ]
    }
  ];

  const features = [
    {
      icon: Globe,
      title: isTamil ? 'பல மொழி ஆதரவு' : 'Multi-language Support',
      description: isTamil ? 'தமிழ் மற்றும் ஆங்கிலத்தில் குறள்களைப் படியுங்கள்' : 'Read kurals in Tamil and English'
    },
    {
      icon: Sparkles,
      title: isTamil ? 'AI வள்ளுவர்' : 'AI Thiruvalluvar',
      description: isTamil ? 'திருவள்ளுவருடன் நேரடியாக உரையாடுங்கள்' : 'Chat directly with AI Thiruvalluvar'
    },
    {
      icon: Heart,
      title: isTamil ? 'விருப்பங்கள்' : 'Favorites',
      description: isTamil ? 'உங்கள் விருப்பமான குறள்களைச் சேமிக்கவும்' : 'Save your favorite kurals'
    },
    {
      icon: MessageCircle,
      title: isTamil ? 'கருத்துகள்' : 'Comments',
      description: isTamil ? 'குறள்கள் பற்றி உங்கள் கருத்துகளைப் பகிருங்கள்' : 'Share your thoughts on kurals'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {isTamil ? 'திருக்குறள் பற்றி' : 'About Thirukkural'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isTamil
              ? 'உலகின் மிகப்பெரிய ஞான நூலான திருக்குறள் மற்றும் அதன் ஆசிரியர் திருவள்ளுவர் பற்றி அறிந்துகொள்ளுங்கள்'
              : 'Learn about Thirukkural, one of the world\'s greatest works of wisdom, and its author Thiruvalluvar'
            }
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Content Sections */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center">
                    <section.icon className="w-6 h-6 mr-3 text-primary-600" />
                    {section.title}
                  </h2>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* KuralVerse Platform */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center">
                  <Code className="w-6 h-6 mr-3 text-primary-600" />
                  {isTamil ? 'குறள்வெர்ஸ் தளம்' : 'KuralVerse Platform'}
                </h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {isTamil
                      ? 'குறள்வெர்ஸ் என்பது திருக்குறளின் அழியாத ஞானத்தை நவீன தொழில்நுட்பத்துடன் இணைத்து வழங்கும் ஒரு நவீன தளமாகும். இது MERN stack (MongoDB, Express, React, Node.js) தொழில்நுட்பத்தில் உருவாக்கப்பட்டுள்ளது.'
                      : 'KuralVerse is a modern platform that brings the timeless wisdom of Thirukkural to the digital age. Built with MERN stack technology (MongoDB, Express, React, Node.js), it offers an interactive experience for exploring Thirukkural.'
                    }
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {isTamil
                      ? 'இந்த தளம் Gemini AI தொழில்நுட்பத்தைப் பயன்படுத்தி திருவள்ளுவர் ஆளுமையில் ஒரு AI உதவியாளரை வழங்குகிறது, இது பயனர்களுக்கு வாழ்க்கை வழிகாட்டுதல் மற்றும் ஞான ஆலோசனைகளை வழங்குகிறது.'
                      : 'The platform features an AI assistant powered by Gemini AI, embodying the persona of Thiruvalluvar himself, providing users with life guidance and wisdom counseling based on Thirukkural principles.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {isTamil ? 'விரைவு புள்ளிவிவரங்கள்' : 'Quick Facts'}
                </h3>
              </div>
              <div className="card-content space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">1330</div>
                  <div className="text-sm text-muted-foreground">{isTamil ? 'குறள்கள்' : 'Kurals'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">133</div>
                  <div className="text-sm text-muted-foreground">{isTamil ? 'அதிகாரங்கள்' : 'Chapters'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">3</div>
                  <div className="text-sm text-muted-foreground">{isTamil ? 'பால்கள்' : 'Sections'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">2000+</div>
                  <div className="text-sm text-muted-foreground">{isTamil ? 'ஆண்டுகள் பழமை' : 'Years Old'}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {isTamil ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
                </h3>
              </div>
              <div className="card-content space-y-2">
                <Link to="/kurals" className="block p-3 rounded-md hover:bg-accent transition-colors">
                  <div className="font-medium text-sm">{isTamil ? 'அனைத்து குறள்கள்' : 'All Kurals'}</div>
                  <div className="text-xs text-muted-foreground">{isTamil ? '1330 குறள்களை ஆராயுங்கள்' : 'Explore all 1330 kurals'}</div>
                </Link>

                <Link to="/category/அறம்" className="block p-3 rounded-md hover:bg-accent transition-colors">
                  <div className="font-medium text-sm">{isTamil ? 'அறம்' : 'Virtue'}</div>
                  <div className="text-xs text-muted-foreground">{isTamil ? 'நல்லொழுக்கம் பற்றிய குறள்கள்' : 'Kurals about virtue'}</div>
                </Link>

                <Link to="/category/பொருள்" className="block p-3 rounded-md hover:bg-accent transition-colors">
                  <div className="font-medium text-sm">{isTamil ? 'பொருள்' : 'Wealth'}</div>
                  <div className="text-xs text-muted-foreground">{isTamil ? 'செல்வம் பற்றிய குறள்கள்' : 'Kurals about wealth'}</div>
                </Link>

                <Link to="/category/இன்பம்" className="block p-3 rounded-md hover:bg-accent transition-colors">
                  <div className="font-medium text-sm">{isTamil ? 'இன்பம்' : 'Love'}</div>
                  <div className="text-xs text-muted-foreground">{isTamil ? 'காதல் பற்றிய குறள்கள்' : 'Kurals about love'}</div>
                </Link>

                <Link to="/chat" className="block p-3 rounded-md hover:bg-accent transition-colors">
                  <div className="font-medium text-sm">{isTamil ? 'AI உரையாடல்' : 'AI Chat'}</div>
                  <div className="text-xs text-muted-foreground">{isTamil ? 'வள்ளுவருடன் பேசுங்கள்' : 'Chat with Valluvar'}</div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {isTamil ? 'தளத்தின் சிறப்பு அம்சங்கள்' : 'Platform Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card max-w-2xl mx-auto">
            <div className="card-content text-center">
              <h2 className="text-2xl font-bold mb-4">
                {isTamil ? 'திருக்குறள் பயணத்தைத் தொடங்குங்கள்' : 'Start Your Thirukkural Journey'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isTamil
                  ? 'திருவள்ளுவரின் அழியாத ஞானத்தை ஆராய்ந்து உங்கள் வாழ்க்கையில் பயன்படுத்துங்கள்'
                  : 'Explore the timeless wisdom of Thiruvalluvar and apply it to your life'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kurals" className="btn-primary btn-lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {isTamil ? 'குறள்களை ஆராயுங்கள்' : 'Explore Kurals'}
                </Link>
                <Link to="/chat" className="btn-outline btn-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isTamil ? 'வள்ளுவருடன் பேசுங்கள்' : 'Chat with Valluvar'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
