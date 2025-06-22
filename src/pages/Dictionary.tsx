
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Volume2, ArrowLeftRight, BookOpen, Search, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WordDefinition from "@/components/WordDefinition";
import { searchWord, getWordSuggestions, WordData } from "@/data/dictionaryData";

const Dictionary = () => {
  const [inputText, setInputText] = useState('');
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('hi');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (inputText.length > 1) {
      const wordSuggestions = getWordSuggestions(inputText);
      setSuggestions(wordSuggestions);
      setShowSuggestions(wordSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputText]);

  const searchForWord = async (query: string = inputText) => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a word to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      const wordData = searchWord(query);
      
      if (wordData) {
        setCurrentWord(wordData);
        setInputText(query);
        
        toast({
          title: "Word Found!",
          description: `Found definition for "${query}"`,
        });
      } else {
        setCurrentWord(null);
        
        toast({
          title: "Word Not Found",
          description: `"${query}" is not available in our dictionary. Try searching for common English or Hindi words.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for the word. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Text-to-speech is not supported in this browser",
        variant: "destructive",
      });
    }
  };

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  };

  const clearSearch = () => {
    setInputText('');
    setCurrentWord(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    searchForWord(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              English-Hindi Dictionary
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive dictionary with detailed definitions, pronunciation, examples, and etymology. Search in English or Hindi.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Dictionary Search
              </CardTitle>
              <CardDescription>
                Enter an English or Hindi word to get comprehensive information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}  
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="from-lang">Search Language</Label>
                  <Select value={fromLanguage} onValueChange={setFromLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapLanguages}
                  className="mt-6"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
                
                <div className="flex-1">
                  <Label htmlFor="to-lang">Result Language</Label>
                  <Select value={toLanguage} onValueChange={setToLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Input */}
              <div className="space-y-2 relative">
                <Label htmlFor="search-input">
                  {fromLanguage === 'en' ? 'Enter English Word' : 'हिंदी शब्द डालें'}
                </Label>
                <div className="relative">
                  <Input
                    id="search-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={fromLanguage === 'en' ? 'e.g., beautiful, knowledge, hello' : 'e.g., नमस्ते, प्रेम, ज्ञान'}
                    className="pr-10"
                    onKeyPress={(e) => e.key === 'Enter' && searchForWord()}
                  />
                  {inputText && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => speakText(inputText, fromLanguage)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1 shadow-lg">
                    <CardContent className="p-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => searchForWord()}
                  disabled={isSearching || !inputText.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isSearching ? 'Searching...' : 'Search Word'}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearSearch}
                  disabled={!inputText && !currentWord}
                >
                  Clear
                </Button>
              </div>

              {/* Popular Words */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Try these words:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['beautiful', 'knowledge', 'serendipity', 'education', 'नमस्ते', 'प्रेम', 'ज्ञान', 'family'].map((word) => (
                    <button
                      key={word}
                      onClick={() => selectSuggestion(word)}
                      className="text-left p-2 hover:bg-white rounded border border-gray-200 transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {currentWord ? (
              <WordDefinition
                wordData={currentWord}
                onSpeak={speakText}
                language={fromLanguage}
              />
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Search for a word
                  </h3>
                  <p className="text-gray-500">
                    Enter a word in the search box to see its definition, pronunciation, examples, and more.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
