
export interface WordData {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  definitions: Array<{
    meaning: string;
    example: string;
    translation: string;
  }>;
  synonyms?: string[];
  antonyms?: string[];
  etymology?: string;
}

export const dictionaryDatabase: Record<string, WordData> = {
  // Common English words with detailed definitions
  'hello': {
    word: 'hello',
    pronunciation: 'həˈloʊ',
    partOfSpeech: 'interjection',
    difficulty: 'beginner',
    definitions: [
      {
        meaning: 'Used as a greeting or to begin a telephone conversation',
        example: 'Hello! How are you today?',
        translation: 'नमस्ते! आज आप कैसे हैं?'
      }
    ],
    synonyms: ['hi', 'greetings', 'hey'],
    etymology: 'From Old High German "halâ, holâ" meaning "to fetch"'
  },
  
  'beautiful': {
    word: 'beautiful',
    pronunciation: 'ˈbjuːtɪfəl',
    partOfSpeech: 'adjective',
    difficulty: 'beginner',
    definitions: [
      {
        meaning: 'Pleasing the senses or mind aesthetically',
        example: 'She wore a beautiful dress to the party.',
        translation: 'उसने पार्टी में एक सुंदर पोशाक पहनी थी।'
      },
      {
        meaning: 'Of a very high standard; excellent',
        example: 'What a beautiful shot in cricket!',
        translation: 'क्रिकेट में कितना सुंदर शॉट!'
      }
    ],
    synonyms: ['lovely', 'gorgeous', 'stunning', 'attractive'],
    antonyms: ['ugly', 'hideous', 'unattractive'],
    etymology: 'From Old French "bel" meaning "beautiful"'
  },

  'knowledge': {
    word: 'knowledge',
    pronunciation: 'ˈnɒlɪdʒ',
    partOfSpeech: 'noun',
    difficulty: 'intermediate',
    definitions: [
      {
        meaning: 'Facts, information, and skills acquired through experience or education',
        example: 'His knowledge of history is impressive.',
        translation: 'इतिहास का उनका ज्ञान प्रभावशाली है।'
      },
      {
        meaning: 'Awareness or familiarity gained by experience',
        example: 'She has first-hand knowledge of the situation.',
        translation: 'उसे स्थिति का प्रत्यक्ष ज्ञान है।'
      }
    ],
    synonyms: ['wisdom', 'understanding', 'expertise', 'learning'],
    antonyms: ['ignorance', 'unawareness'],
    etymology: 'From Middle English "knowlege", from "know" + "-lege"'
  },

  'serendipity': {
    word: 'serendipity',
    pronunciation: 'ˌserənˈdɪpɪti',
    partOfSpeech: 'noun',
    difficulty: 'advanced',
    definitions: [
      {
        meaning: 'The occurrence and development of events by chance in a happy or beneficial way',
        example: 'A fortunate stroke of serendipity brought them together.',
        translation: 'एक भाग्यशाली संयोग ने उन्हें एक साथ लाया।'
      }
    ],
    synonyms: ['chance', 'fortune', 'luck', 'coincidence'],
    etymology: 'Coined by Horace Walpole in 1754, from the Persian fairy tale "The Three Princes of Serendip"'
  },

  'friendship': {
    word: 'friendship',
    pronunciation: 'ˈfrendʃɪp',
    partOfSpeech: 'noun',
    difficulty: 'beginner',
    definitions: [
      {
        meaning: 'The emotions or conduct of friends; the state of being friends',
        example: 'Their friendship lasted for decades.',
        translation: 'उनकी दोस्ती दशकों तक चली।'
      }
    ],
    synonyms: ['companionship', 'fellowship', 'camaraderie'],
    antonyms: ['enmity', 'hostility'],
    etymology: 'From Old English "freondscipe"'
  },

  'education': {
    word: 'education',
    pronunciation: 'ˌedʒʊˈkeɪʃən',
    partOfSpeech: 'noun',
    difficulty: 'intermediate',
    definitions: [
      {
        meaning: 'The process of receiving or giving systematic instruction',
        example: 'Education is the key to success.',
        translation: 'शिक्षा सफलता की कुंजी है।'
      },
      {
        meaning: 'An enlightening experience',
        example: 'Traveling was a real education for him.',
        translation: 'यात्रा करना उसके लिए वास्तव में एक शिक्षा थी।'
      }
    ],
    synonyms: ['learning', 'schooling', 'instruction', 'teaching'],
    etymology: 'From Latin "educationem", from "educare" meaning "to bring up, rear"'
  },

  // Hindi words with English translations
  'नमस्ते': {
    word: 'नमस्ते',
    pronunciation: 'nəməsteː',
    partOfSpeech: 'interjection',
    difficulty: 'beginner',
    definitions: [
      {
        meaning: 'A respectful greeting in Hindu culture',
        example: 'नमस्ते, आप कैसे हैं?',
        translation: 'Hello, how are you?'
      }
    ],
    etymology: 'From Sanskrit "namas" (bow) + "te" (to you)'
  },

  'प्रेम': {
    word: 'प्रेम',
    pronunciation: 'preːm',
    partOfSpeech: 'noun',
    difficulty: 'beginner',
    definitions: [
      {
        meaning: 'A deep feeling of affection and care',
        example: 'माता-पिता का प्रेम अनमोल होता है।',
        translation: 'A parent\'s love is priceless.'
      }
    ],
    synonyms: ['प्यार', 'स्नेह', 'मोहब्बत'],
    etymology: 'From Sanskrit "prema"'
  },

  'ज्ञान': {
    word: 'ज्ञान',
    pronunciation: 'ɡjaːn',
    partOfSpeech: 'noun',
    difficulty: 'intermediate',
    definitions: [
      {
        meaning: 'Knowledge, wisdom, or understanding',
        example: 'ज्ञान ही सच्ची संपत्ति है।',
        translation: 'Knowledge is the true wealth.'
      }
    ],
    synonyms: ['विद्या', 'बुद्धि', 'समझ'],
    etymology: 'From Sanskrit "jñāna"'
  },

  'family': {
    word: 'family',
    pronunciation: 'ˈfæməli',
    partOfSpeech: 'noun',
    difficulty: 'beginner',
    definitions: [
      {
        meaning: 'A group of people related by blood or marriage',
        example: 'Family is the most important thing in life.',
        translation: 'परिवार जीवन की सबसे महत्वपूर्ण चीज़ है।'
      }
    ],
    synonyms: ['relatives', 'kin', 'household'],
    etymology: 'From Latin "familia"'
  },

  'water': {
    word: 'water',
    pronunciation: 'ˈwɔːtər',
    partOfSpeech: 'noun',
    difficulty: 'beginner',
    definitions: [
      {
        meaning: 'A colorless, transparent, odorless liquid essential for life',
        example: 'Please give me a glass of water.',
        translation: 'कृपया मुझे एक गिलास पानी दें।'
      }
    ],
    synonyms: ['H2O', 'aqua'],
    etymology: 'From Old English "wæter"'
  }
};

export const getWordSuggestions = (input: string): string[] => {
  const words = Object.keys(dictionaryDatabase);
  return words
    .filter(word => word.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 8);
};

export const searchWord = (query: string): WordData | null => {
  const normalizedQuery = query.toLowerCase().trim();
  return dictionaryDatabase[normalizedQuery] || null;
};
