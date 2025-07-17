import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import ThiruvalluvarImage from './ThiruvalluvarImage';
import { Heart, Github, Mail } from 'lucide-react';

const Footer = () => {
  const { isTamil } = useTheme();



  return (
    <footer className="bg-sandalwood-600 border-t-4 border-sandalwood-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Project - Column 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <ThiruvalluvarImage size="md" style="icon" />
              <span className="font-bold text-xl text-manuscript-50 font-catamaran-bold">
                {isTamil ? 'குறள்VERSE' : 'KuralVerse'}
              </span>
            </div>
            <p className="text-sm text-manuscript-100 font-catamaran leading-relaxed">
              {isTamil
                ? 'திருக்குறளின் அழியாத ஞானத்தை நவீன தொழில்நுட்பத்துடன் இணைத்து வழங்கும் தளம். திருவள்ளுவரின் 1330 குறள்களை எளிதாக அணுகவும், புரிந்துகொள்ளவும் உதவுகிறது.'
                : 'A platform bringing the timeless wisdom of Thirukkural to the modern world through technology. Making Thiruvalluvar\'s 1330 kurals easily accessible and understandable.'
              }
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/vasantha-kumar-s"
                target="_blank"
                rel="noopener noreferrer"
                className="text-manuscript-200 hover:text-saffron-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/vasantha-kumar-s/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-manuscript-200 hover:text-saffron-300 transition-colors"
                aria-label="LinkedIn"
              >
                <span className="w-5 h-5 text-blue-400 text-lg">💼</span>
              </a>
              <a
                href="mailto:vasanthakumarselvaraj04@gmail.com"
                className="text-manuscript-200 hover:text-saffron-300 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Column 2 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-manuscript-50 font-catamaran-semibold flex items-center">
              🪔 {isTamil ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/category/அறம்"
                  className="text-sm text-manuscript-200 hover:text-saffron-300 transition-colors font-catamaran flex items-center"
                >
                  <span className="mr-2">🪔</span>
                  {isTamil ? 'அறம் (நல்லொழுக்கம்)' : 'Virtue (அறம்)'}
                </Link>
              </li>
              <li>
                <Link
                  to="/category/பொருள்"
                  className="text-sm text-manuscript-200 hover:text-saffron-300 transition-colors font-catamaran flex items-center"
                >
                  <span className="mr-2">👑</span>
                  {isTamil ? 'பொருள் (செல்வம்)' : 'Wealth (பொருள்)'}
                </Link>
              </li>
              <li>
                <Link
                  to="/category/இன்பம்"
                  className="text-sm text-manuscript-200 hover:text-saffron-300 transition-colors font-catamaran flex items-center"
                >
                  <span className="mr-2">❤️</span>
                  {isTamil ? 'இன்பம் (காதல்)' : 'Love (இன்பம்)'}
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="text-sm text-manuscript-200 hover:text-saffron-300 transition-colors font-catamaran flex items-center"
                >
                  <span className="mr-2">💬</span>
                  {isTamil ? 'வள்ளுவருடன் பேசுங்கள்' : 'Chat with Valluvar'}
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-sm text-manuscript-200 hover:text-saffron-300 transition-colors font-catamaran flex items-center"
                >
                  <span className="mr-2">🔍</span>
                  {isTamil ? 'குறள் தேடல்' : 'Search Kurals'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Credits - Column 3 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-manuscript-50 font-catamaran-semibold flex items-center">
              📞 {isTamil ? 'தொடர்பு & நன்றி' : 'Contact & Credits'}
            </h3>
            <div className="space-y-3">
              <div className="text-sm text-manuscript-200 font-catamaran">
                <p className="mb-3">
                  {isTamil ? 'இந்த திட்டம் திருக்குறளின் மகத்துவத்தை பரப்பும் நோக்கத்துடன் உருவாக்கப்பட்டுள்ளது.' : 'This project is created to spread the greatness of Thirukkural.'}
                </p>

                {/* Developer Contact */}
                <div className="mb-3">
                  <p className="font-semibold mb-2">{isTamil ? 'உருவாக்கியவர்:' : 'Developer:'}</p>
                  <p className="mb-1">Vasantha Kumar S</p>
                  <div className="flex flex-col space-y-1">
                    <a
                      href="https://github.com/vasantha-kumar-s"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-manuscript-200 hover:text-saffron-300 transition-colors flex items-center"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/vasantha-kumar-s/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-manuscript-200 hover:text-saffron-300 transition-colors flex items-center"
                    >
                      <span className="w-4 h-4 mr-2 text-blue-400">💼</span>
                      LinkedIn
                    </a>
                    <a
                      href="mailto:vasanthakumarselvaraj04@gmail.com"
                      className="text-manuscript-200 hover:text-saffron-300 transition-colors flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-sm text-manuscript-200 font-catamaran">
                <p className="font-semibold mb-1">{isTamil ? 'தொழில்நுட்பம்:' : 'Technology:'}</p>
                <p>React • Node.js • MongoDB</p>
                <p>Tailwind CSS • Gemini AI</p>
              </div>

              <div className="text-xs text-manuscript-300 font-catamaran">
                <p>{isTamil ? 'கல்வி நோக்கத்திற்காக மட்டுமே.' : 'For educational purposes only.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-sandalwood-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-manuscript-200 font-catamaran">
              {isTamil ? (
                <>
                  © 2025 குறள்VERSE · அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை
                </>
              ) : (
                <>
                  © 2025 KuralVerse · All rights reserved
                </>
              )}
            </div>

            <div className="flex items-center space-x-1 text-sm text-manuscript-200 font-catamaran">
              <span>
                {isTamil ? 'அன்புடன் உருவாக்கப்பட்டது' : 'Built with'}
              </span>
              <Heart className="w-4 h-4 text-saffron-400 fill-current" />
              <span>
                {isTamil ? 'தமிழ் கலாச்சாரத்திற்காக' : 'for Tamil culture'}
              </span>
            </div>
          </div>

          {/* Cultural Footer */}
          <div className="mt-6 text-center">
            <div className="tamil-divider mb-4"></div>
            <div className="text-xs text-manuscript-300 font-catamaran">
              <p className="mb-2">
                {isTamil ? (
                  <>
                    📚 திருக்குறள் · 📩 தொடர்பு · 📖 உரிமம்
                  </>
                ) : (
                  <>
                    📚 About · 📩 Contact · 📖 License
                  </>
                )}
              </p>
              <p>
                {isTamil ? (
                  <>
                    திருக்குறள் - திருவள்ளுவர் அருளிய அழியாத ஞான நூல் · கல்வி நோக்கத்திற்காக மட்டுமே
                  </>
                ) : (
                  <>
                    Thirukkural - Eternal wisdom by Thiruvalluvar · For educational purposes only
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
