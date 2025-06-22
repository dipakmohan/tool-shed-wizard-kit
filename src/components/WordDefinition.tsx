
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, BookOpen, Star } from "lucide-react";

interface WordData {
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

interface WordDefinitionProps {
  wordData: WordData;
  onSpeak: (text: string, lang: string) => void;
  language: string;
}

const WordDefinition: React.FC<WordDefinitionProps> = ({ wordData, onSpeak, language }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-gray-800">{wordData.word}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(wordData.word, language)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <Badge className={getDifficultyColor(wordData.difficulty)}>
            {wordData.difficulty}
          </Badge>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Pronunciation:</span>
            <span className="font-mono text-blue-700">/{wordData.pronunciation}/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(wordData.pronunciation, 'en')}
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              <Volume2 className="h-3 w-3" />
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            {wordData.partOfSpeech}
          </Badge>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Definitions
          </h4>
          {wordData.definitions.map((def, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
              <p className="text-gray-800 mb-2">{def.meaning}</p>
              <p className="text-sm text-gray-600 italic mb-1">{def.example}</p>
              <p className="text-sm font-medium text-blue-700">{def.translation}</p>
            </div>
          ))}
        </div>

        {wordData.synonyms && wordData.synonyms.length > 0 && (
          <div className="mt-4">
            <h5 className="font-medium text-gray-700 mb-2">Synonyms:</h5>
            <div className="flex flex-wrap gap-2">
              {wordData.synonyms.map((synonym, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {synonym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {wordData.antonyms && wordData.antonyms.length > 0 && (
          <div className="mt-4">
            <h5 className="font-medium text-gray-700 mb-2">Antonyms:</h5>
            <div className="flex flex-wrap gap-2">
              {wordData.antonyms.map((antonym, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {antonym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {wordData.etymology && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-1">Etymology:</h5>
            <p className="text-sm text-gray-600">{wordData.etymology}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordDefinition;
