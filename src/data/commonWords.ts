
export const commonEnglishWords = [
  // High frequency words
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
  'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
  
  // Common nouns
  'house', 'car', 'dog', 'cat', 'book', 'tree', 'school', 'work', 'food', 'music', 'movie', 'phone', 'computer', 'internet', 'game',
  'friend', 'family', 'mother', 'father', 'child', 'student', 'teacher', 'doctor', 'nurse', 'police', 'fire', 'hospital', 'restaurant',
  'money', 'business', 'job', 'office', 'meeting', 'project', 'idea', 'problem', 'solution', 'question', 'answer', 'story', 'news',
  
  // Common verbs
  'run', 'walk', 'talk', 'speak', 'listen', 'read', 'write', 'think', 'feel', 'see', 'hear', 'touch', 'taste', 'smell',
  'eat', 'drink', 'sleep', 'wake', 'play', 'work', 'study', 'learn', 'teach', 'help', 'love', 'like', 'want', 'need',
  'buy', 'sell', 'give', 'take', 'bring', 'send', 'receive', 'open', 'close', 'start', 'stop', 'finish', 'begin',
  
  // Common adjectives
  'good', 'bad', 'big', 'small', 'long', 'short', 'high', 'low', 'fast', 'slow', 'hot', 'cold', 'warm', 'cool',
  'happy', 'sad', 'angry', 'excited', 'tired', 'hungry', 'thirsty', 'sick', 'healthy', 'strong', 'weak',
  'easy', 'difficult', 'simple', 'complex', 'important', 'interesting', 'boring', 'funny', 'serious', 'quiet', 'loud',
  
  // Academic and professional words
  'analysis', 'research', 'development', 'management', 'organization', 'communication', 'information', 'technology', 'science',
  'mathematics', 'history', 'geography', 'literature', 'philosophy', 'psychology', 'sociology', 'economics', 'politics',
  'government', 'democracy', 'freedom', 'justice', 'equality', 'responsibility', 'opportunity', 'challenge', 'success',
  
  // Advanced vocabulary
  'achievement', 'adventure', 'behavior', 'celebration', 'creativity', 'decision', 'environment', 'experience',
  'imagination', 'independence', 'knowledge', 'leadership', 'motivation', 'opportunity', 'personality', 'relationship',
  'cooperation', 'competition', 'collaboration', 'innovation', 'inspiration', 'determination', 'perseverance',
  
  // Technology terms
  'software', 'hardware', 'application', 'website', 'email', 'password', 'username', 'database', 'algorithm',
  'artificial', 'intelligence', 'machine', 'learning', 'programming', 'coding', 'debugging', 'testing',
  
  // Nature and science
  'animal', 'plant', 'flower', 'bird', 'fish', 'insect', 'forest', 'mountain', 'river', 'ocean', 'sky', 'cloud',
  'weather', 'climate', 'temperature', 'season', 'spring', 'summer', 'autumn', 'winter', 'rain', 'snow', 'wind',
  'earth', 'planet', 'solar', 'system', 'universe', 'galaxy', 'star', 'moon', 'sun', 'light', 'energy', 'matter',
  
  // Arts and culture
  'art', 'painting', 'drawing', 'sculpture', 'dance', 'theater', 'concert', 'exhibition', 'museum', 'gallery',
  'culture', 'tradition', 'custom', 'festival', 'ceremony', 'celebration', 'holiday', 'vacation', 'travel', 'journey',
  
  // Complex words for advanced learners
  'serendipity', 'melancholy', 'nostalgia', 'ephemeral', 'ubiquitous', 'paradigm', 'phenomenon', 'hypothesis',
  'consciousness', 'subconscious', 'perspective', 'perception', 'interpretation', 'comprehension', 'understanding',
  'magnificent', 'extraordinary', 'spectacular', 'tremendous', 'incredible', 'outstanding', 'exceptional', 'remarkable'
];

export const getRandomSuggestedWords = (count: number = 8): string[] => {
  const shuffled = [...commonEnglishWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchSimilarWords = (query: string, limit: number = 10): string[] => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.length < 2) return [];
  
  const matches = commonEnglishWords.filter(word => 
    word.toLowerCase().includes(queryLower)
  );
  
  // Sort by relevance (exact matches first, then starts with, then contains)
  const sorted = matches.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    if (aLower === queryLower) return -1;
    if (bLower === queryLower) return 1;
    if (aLower.startsWith(queryLower) && !bLower.startsWith(queryLower)) return -1;
    if (bLower.startsWith(queryLower) && !aLower.startsWith(queryLower)) return 1;
    
    return a.length - b.length;
  });
  
  return sorted.slice(0, limit);
};
