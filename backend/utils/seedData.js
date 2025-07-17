import mongoose from 'mongoose';
import Kural from '../models/Kural.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample Kurals data for testing (first 10 Kurals from Aram section)
const sampleKurals = [
  {
    number: 1,
    paal: 'அறம்',
    adhigaram_no: 1,
    adhigaram: 'கடவுள் வாழ்த்து',
    kural_index: 1,
    line1: 'அகர முதல எழுத்தெல்லாம் ஆதி',
    line2: 'பகவன் முதற்றே உலகு',
    transliteration: 'Agara mudala ezhuththellaam aadhi\nBhagavan mudhatre ulagu',
    meaning_ta: 'எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாகக் கொண்டிருப்பது போல், உலகம் கடவுளை அடிப்படையாகக் கொண்டிருக்கிறது.',
    meaning_en: 'As the letter A is the first of all letters, so the eternal God is first and foremost in the world.',
    commentary_parimel: 'எழுத்துக்களுக்கெல்லாம் அகரம் முதன்மையானது போல, உலகத்திற்கு இறைவன் முதன்மையானவன் என்பது இக்குறளின் பொருள்.',
    commentary_karunanidhi: 'அகரம் எழுத்துக்களின் தலைவன். அதுபோல் கடவுள் உலகின் தலைவன்.',
    commentary_yogi: 'முதல் எழுத்தான அகரத்தைப் போல, கடவுள் உலகின் முதல் காரணம்.'
  },
  {
    number: 2,
    paal: 'அறம்',
    adhigaram_no: 1,
    adhigaram: 'கடவுள் வாழ்த்து',
    kural_index: 2,
    line1: 'கற்றதனால் ஆய பயனென்கொல் வாலறிவன்',
    line2: 'நற்றாள் தொழாஅர் எனின்',
    transliteration: 'Katradhanaal aaya payanen kol vaalariwan\nNatraal thozhaaar enin',
    meaning_ta: 'சிறந்த அறிவுடையவன் கற்ற கல்வியால் பயன் என்ன, அவன் இறைவனின் திருவடிகளை வணங்காவிட்டால்?',
    meaning_en: 'What avails learning if the learned one does not worship the good feet of Him who has pure knowledge?',
    commentary_parimel: 'முழுமையான அறிவுடைய இறைவனின் திருவடிகளை வணங்காத கற்றவனின் கல்வி பயனற்றது.',
    commentary_karunanidhi: 'கடவுளை வணங்காத கல்வி வீணானது.',
    commentary_yogi: 'இறைவணக்கம் இல்லாத கல்வி பயனற்றது.'
  },
  {
    number: 3,
    paal: 'அறம்',
    adhigaram_no: 1,
    adhigaram: 'கடவுள் வாழ்த்து',
    kural_index: 3,
    line1: 'மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்',
    line2: 'நிலமிசை நீடுவாழ் வார்',
    transliteration: 'Malarmisai ekinaan maanadi serndhar\nNilamisa needuvazh vaar',
    meaning_ta: 'தாமரை மலரில் வீற்றிருக்கும் இறைவனின் சிறந்த திருவடிகளை அடைந்தவர்கள் இந்த உலகில் நீண்ட காலம் வாழ்வார்கள்.',
    meaning_en: 'Those who have reached the excellent feet of Him who walks on the flower (lotus) will live long on this earth.',
    commentary_parimel: 'தாமரை மலரில் வீற்றிருக்கும் இறைவனின் திருவடிகளை அடைந்தவர்கள் நீண்ட ஆயுளுடன் வாழ்வார்கள்.',
    commentary_karunanidhi: 'இறைவனின் அருளைப் பெற்றவர்கள் நீண்ட காலம் வாழ்வார்கள்.',
    commentary_yogi: 'இறைவனின் திருவடிகளை அடைந்தவர்கள் நீண்ட ஆயுள் பெறுவார்கள்.'
  },
  {
    number: 4,
    paal: 'அறம்',
    adhigaram_no: 1,
    adhigaram: 'கடவுள் வாழ்த்து',
    kural_index: 4,
    line1: 'வேண்டுதல் வேண்டாமை இலாதான் இடைசெய்த',
    line2: 'நீண்டுதல் வேண்டா துலகு',
    transliteration: 'Vendudhal vendaamai ilaathaan idaiseytha\nNeendudhal vendaa dhulagu',
    meaning_ta: 'விருப்பு வெறுப்பு இல்லாத இறைவன் படைத்த இந்த உலகம் நீண்ட காலம் நிலைத்திருக்க வேண்டும் என்று விரும்புவதில்லை.',
    meaning_en: 'The world does not desire to be prolonged, which is created by Him who is free from desire and aversion.',
    commentary_parimel: 'விருப்பு வெறுப்பு இல்லாத இறைவன் படைத்த உலகம் தானாகவே நிலைத்திருக்கும்.',
    commentary_karunanidhi: 'இறைவன் படைத்த உலகம் தானாகவே நிலைத்திருக்கும்.',
    commentary_yogi: 'இறைவனின் படைப்பு தானாகவே நிலைத்திருக்கும்.'
  },
  {
    number: 5,
    paal: 'அறம்',
    adhigaram_no: 1,
    adhigaram: 'கடவுள் வாழ்த்து',
    kural_index: 5,
    line1: 'இருள்சேர் இருவினையும் சேரா இறைவன்',
    line2: 'பொருள்சேர் புகழ்புரிந்தார் மாட்டு',
    transliteration: 'Irulsaer iruvinayum saeraa iraivan\nPorulsaer pugazhpurindhar maattu',
    meaning_ta: 'இறைவனின் பொருளுடைய புகழை மனதில் கொண்டவர்களிடம் இருளைத் தரும் இரு வினைகளும் (பாவ புண்ணியங்களும்) சேராது.',
    meaning_en: 'The two dark deeds (sin and virtue) will not adhere to those who have enshrined in their hearts the glory of God.',
    commentary_parimel: 'இறைவனின் புகழை மனதில் கொண்டவர்களுக்கு பாவ புண்ணியங்கள் பாதிப்பு தராது.',
    commentary_karunanidhi: 'இறைவனை வணங்குபவர்களுக்கு பாவ புண்ணியங்கள் தீங்கு செய்யாது.',
    commentary_yogi: 'இறைவனின் அருளைப் பெற்றவர்களுக்கு கர்ம பலன்கள் பாதிப்பு தராது.'
  }
];

// Function to seed sample data
export const seedSampleData = async () => {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kuralverse');
      console.log('✅ Connected to MongoDB for seeding');
    }
    
    // Clear existing data
    await Kural.deleteMany({});
    console.log('🗑️ Cleared existing Kural data');
    
    // Insert sample data
    const insertedKurals = await Kural.insertMany(sampleKurals);
    console.log(`✅ Inserted ${insertedKurals.length} sample Kurals`);
    
    // Create text indexes
    await Kural.collection.createIndex({
      line1: 'text',
      line2: 'text',
      meaning_ta: 'text',
      meaning_en: 'text',
      commentary_parimel: 'text',
      commentary_karunanidhi: 'text',
      commentary_yogi: 'text',
      transliteration: 'text'
    });
    console.log('✅ Created text search indexes');
    
    console.log('🎉 Data seeding completed successfully!');
    
    return insertedKurals;
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

// Function to generate more sample data (for development)
export const generateMoreSampleData = () => {
  const paals = ['அறம்', 'பொருள்', 'இன்பம்'];
  const adhigarams = {
    'அறம்': [
      'கடவுள் வாழ்த்து', 'வான்சிறப்பு', 'நீத்தார் பெருமை', 'அறன்வலியுறுத்தல்',
      'இல்வாழ்க்கை', 'வாழ்க்கைத் துணைநலம்', 'புதல்வரைப் பெறுதல்', 'அன்புடைமை',
      'விருந்தோம்பல்', 'இனியவைகூறல்', 'செய்ந்நன்றி அறிதல்', 'நடுவுநிலைமை',
      'அடக்கமுடைமை', 'ஒழுக்கமுடைமை'
    ],
    'பொருள்': [
      'இறைமாட்சி', 'கல்வி', 'நாடு', 'அரண்', 'நட்பு', 'படைமாட்சி', 'குடிமை',
      'உழவு', 'நல்குரவு', 'இரவு', 'கயமை', 'நன்றியில்செல்வம்', 'இன்னாசெய்யாமை'
    ],
    'இன்பம்': [
      'களவு', 'கற்பு', 'நலம்புனைந்துரைத்தல்', 'காதற்சிறப்புரைத்தல்', 'நாணுத்துறவுரைத்தல்',
      'அலர்அறிவுறுத்தல்', 'பிரிவாற்றாமை', 'படர்மெலிந்திரங்கல்', 'கண்விதுப்பழிதல்',
      'பசப்புறுபருவரல்', 'தனிப்படர்மிகுதி', 'நினைந்தவர்புலம்பல்', 'கனவுநிலையுரைத்தல்',
      'பொழுதுகண்டிரங்கல்', 'உறுப்பு நலனழிதல்'
    ]
  };
  
  const moreKurals = [];
  let kuralNumber = 6;
  
  for (let i = 0; i < 20; i++) {
    const paal = paals[Math.floor(Math.random() * paals.length)];
    const adhigaramList = adhigarams[paal];
    const adhigaram = adhigaramList[Math.floor(Math.random() * adhigaramList.length)];
    
    moreKurals.push({
      number: kuralNumber++,
      paal,
      adhigaram_no: Math.floor(Math.random() * 10) + 1,
      adhigaram,
      kural_index: Math.floor(Math.random() * 10) + 1,
      line1: `Sample Tamil line 1 for Kural ${kuralNumber - 1}`,
      line2: `Sample Tamil line 2 for Kural ${kuralNumber - 1}`,
      transliteration: `Sample transliteration for Kural ${kuralNumber - 1}`,
      meaning_ta: `இது ${kuralNumber - 1}வது குறளின் தமிழ் பொருள்.`,
      meaning_en: `This is the English meaning for Kural ${kuralNumber - 1}.`,
      commentary_parimel: `பரிமேலழகர் உரை for Kural ${kuralNumber - 1}.`,
      commentary_karunanidhi: `கருணாநிதி உரை for Kural ${kuralNumber - 1}.`,
      commentary_yogi: `யோகி உரை for Kural ${kuralNumber - 1}.`
    });
  }
  
  return moreKurals;
};

// CLI script to run seeding
if (process.argv[2] === 'seed') {
  seedSampleData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
