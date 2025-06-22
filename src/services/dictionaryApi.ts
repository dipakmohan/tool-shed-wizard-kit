
export interface ApiWordData {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
  origin?: string;
}

export const fetchWordFromApi = async (word: string): Promise<ApiWordData | null> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return data[0]; // Return the first result
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from dictionary API:', error);
    return null;
  }
};

export const convertApiDataToWordData = (apiData: ApiWordData) => {
  const firstMeaning = apiData.meanings[0];
  const firstDefinition = firstMeaning?.definitions[0];
  
  return {
    word: apiData.word,
    pronunciation: apiData.phonetic || 'N/A',
    partOfSpeech: firstMeaning?.partOfSpeech || 'unknown',
    difficulty: 'intermediate' as const,
    definitions: apiData.meanings.flatMap(meaning =>
      meaning.definitions.slice(0, 2).map(def => ({
        meaning: def.definition,
        example: def.example || `Example with "${apiData.word}" would go here.`,
        translation: `Translation of "${apiData.word}" would appear here.`
      }))
    ).slice(0, 3),
    synonyms: firstDefinition?.synonyms?.slice(0, 5) || [],
    antonyms: firstDefinition?.antonyms?.slice(0, 5) || [],
    etymology: apiData.origin || undefined
  };
};
