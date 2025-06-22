
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Volume2, ArrowLeftRight, BookOpen, Search, Lightbulb, Globe, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WordDefinition from "@/components/WordDefinition";
import WordOfTheDay from "@/components/WordOfTheDay";
import { WordData } from "@/data/dictionaryData";
import { enhancedWordSearch, getEnhancedSuggestions } from "@/services/enhancedDictionary";

const Dictionary = () => {
  const [inputText, setInputText] = useState('');
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('hi');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSource, setSearchSource] = useState<'local' | 'api' | 'not-found'>('not-found');
  const { toast } = useToast();

  useEffect(() => {
    if (inputText.length > 1) {
      const wordSuggestions = getEnhancedSuggestions(inputText);
      setSuggestions(wordSuggestions);
      setShowSuggestions(wordSuggestions.length > 0);
    } else {
      const randomSuggestions = getEnhancedSuggestions('');
      setSuggestions(randomSuggestions);
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
      const result = await enhancedWordSearch(query);
      
      if (result.wordData) {
        setCurrentWord(result.wordData);
        setSearchSource(result.source);
        setInputText(query);
        
        const sourceText = result.source === 'local' ? 'local database' : 'online dictionary API';
        toast({
          title: "Word Found!",
          description: `Found "${query}" in ${sourceText}`,
        });
      } else {
        setCurrentWord(null);
        setSearchSource('not-found');
        
        toast({
          title: "Word Not Found",
          description: `"${query}" is not available in our dictionary or online sources. Try searching for other words.`,
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
    setSuggestions(getEnhancedSuggestions(''));
    setShowSuggestions(false);
    setSearchSource('not-found');
  };

  const selectSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    searchForWord(suggestion);
  };

  const handleWordOfTheDaySelect = (word: string) => {
    setInputText(word);
    searchForWord(word);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Enhanced English-Hindi Dictionary
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive dictionary with local database + online API integration. Get detailed definitions, pronunciation, examples, and etymology.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Local Database</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Online API</span>
            </div>
            <div className="flex items-center gap-1">
              <Languages className="h-4 w-4" />
              <span>50,000+ Words</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Dictionary Search
                  {searchSource !== 'not-found' && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      searchSource === 'local' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {searchSource === 'local' ? 'Local DB' : 'Online API'}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Search from our local database or get definitions from online dictionary API
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
                      placeholder={fromLanguage === 'en' ? 'e.g., beautiful, serendipity, technology' : 'e.g., नमस्ते, प्रेम, ज्ञान'}
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

                  {/* Enhanced Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <Card className="absolute z-10 w-full mt-1 shadow-lg">
                      <CardContent className="p-2">
                        <div className="text-xs text-gray-500 mb-2 px-2">Smart Suggestions</div>
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => selectSuggestion(suggestion)}
                            className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-between"
                          >
                            <span>{suggestion}</span>
                            <span className="text-xs text-gray-400">
                              {suggestion.length > 10 ? 'Advanced' : 'Common'}
                            </span>
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
                    {suggestions.slice(0, 8).map((word) => (
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
                    Enter a word in the search box to see its definition, pronunciation, examples, and more from our enhanced database.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Word of the Day Section */}
          <div className="space-y-6">
            <WordOfTheDay
              onWordSelect={handleWordOfTheDaySelect}
              onSpeak={speakText}
            />
            
            {/* Statistics Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Dictionary Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Local Words:</span>
                  <span className="font-semibold">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Common Words DB:</span>
                  <span className="font-semibold">200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Coverage:</span>
                  <span className="font-semibold">300,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-semibold">EN + HI</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
