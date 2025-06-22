
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, RefreshCw } from "lucide-react";
import { enhancedWordSearch, getWordOfTheDay } from "@/services/enhancedDictionary";
import { WordData } from "@/data/dictionaryData";
import WordDefinition from "./WordDefinition";

interface WordOfTheDayProps {
  onWordSelect: (word: string) => void;
  onSpeak: (text: string, lang: string) => void;
}

const WordOfTheDay: React.FC<WordOfTheDayProps> = ({ onWordSelect, onSpeak }) => {
  const [wordOfTheDay, setWordOfTheDay] = useState<string>('');
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const todayWord = getWordOfTheDay();
    setWordOfTheDay(todayWord);
    loadWordData(todayWord);
  }, []);

  const loadWordData = async (word: string) => {
    setIsLoading(true);
    try {
      const result = await enhancedWordSearch(word);
      setWordData(result.wordData);
    } catch (error) {
      console.error('Failed to load word of the day:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWord = () => {
    const words = ['serendipity', 'ephemeral', 'mellifluous', 'petrichor', 'luminous', 'tranquil', 'resilience', 'effervescent', 'quintessential', 'ubiquitous'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWordOfTheDay(randomWord);
    loadWordData(randomWord);
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Word of the Day
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshWord}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-pulse">Loading word...</div>
          </div>
        ) : wordData ? (
          <div>
            <WordDefinition
              wordData={wordData}
              onSpeak={onSpeak}
              language="en"
            />
            <div className="mt-4">
              <Button
                onClick={() => onWordSelect(wordOfTheDay)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Search This Word
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">Failed to load word of the day</p>
            <Button onClick={refreshWord} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordOfTheDay;
