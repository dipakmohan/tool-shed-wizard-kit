
import { WordData, searchWord as searchLocalWord, getWordSuggestions as getLocalSuggestions } from '@/data/dictionaryData';
import { fetchWordFromApi, convertApiDataToWordData } from './dictionaryApi';
import { searchSimilarWords, getRandomSuggestedWords } from '@/data/commonWords';

export interface SearchResult {
  wordData: WordData | null;
  source: 'local' | 'api' | 'not-found';
  isLoading?: boolean;
}

export const enhancedWordSearch = async (query: string): Promise<SearchResult> => {
  if (!query.trim()) {
    return { wordData: null, source: 'not-found' };
  }

  // First, try local database
  const localResult = searchLocalWord(query);
  if (localResult) {
    return { wordData: localResult, source: 'local' };
  }

  // If not found locally, try the API
  try {
    const apiResult = await fetchWordFromApi(query);
    if (apiResult) {
      const convertedData = convertApiDataToWordData(apiResult);
      return { wordData: convertedData, source: 'api' };
    }
  } catch (error) {
    console.error('API search failed:', error);
  }

  return { wordData: null, source: 'not-found' };
};

export const getEnhancedSuggestions = (query: string): string[] => {
  if (!query || query.length < 2) {
    return getRandomSuggestedWords(8);
  }

  // Combine local suggestions with common word suggestions
  const localSuggestions = getLocalSuggestions(query);
  const commonWordSuggestions = searchSimilarWords(query, 8);
  
  // Merge and deduplicate
  const allSuggestions = [...new Set([...localSuggestions, ...commonWordSuggestions])];
  
  return allSuggestions.slice(0, 8);
};

export const getWordOfTheDay = (): string => {
  const words = ['serendipity', 'ephemeral', 'mellifluous', 'petrichor', 'luminous', 'tranquil', 'resilience'];
  const today = new Date().getDay();
  return words[today] || words[0];
};
