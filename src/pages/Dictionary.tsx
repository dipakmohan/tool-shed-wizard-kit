
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Volume2, ArrowLeftRight, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dictionary = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [pronunciation, setPronunciation] = useState('');
  const { toast } = useToast();

  // Common English-Hindi word pairs for offline functionality
  const commonTranslations: Record<string, { hi: string; en: string; pronunciation: string }> = {
    'hello': { hi: 'नमस्ते', en: 'hello', pronunciation: 'namaste' },
    'goodbye': { hi: 'अलविदा', en: 'goodbye', pronunciation: 'alvida' },
    'thank you': { hi: 'धन्यवाद', en: 'thank you', pronunciation: 'dhanyawad' },
    'please': { hi: 'कृपया', en: 'please', pronunciation: 'kripaya' },
    'yes': { hi: 'हाँ', en: 'yes', pronunciation: 'haan' },
    'no': { hi: 'नहीं', en: 'no', pronunciation: 'nahin' },
    'water': { hi: 'पानी', en: 'water', pronunciation: 'paani' },
    'food': { hi: 'खाना', en: 'food', pronunciation: 'khaana' },
    'house': { hi: 'घर', en: 'house', pronunciation: 'ghar' },
    'family': { hi: 'परिवार', en: 'family', pronunciation: 'parivar' },
    'friend': { hi: 'दोस्त', en: 'friend', pronunciation: 'dost' },
    'love': { hi: 'प्रेम', en: 'love', pronunciation: 'prem' },
    'beautiful': { hi: 'सुंदर', en: 'beautiful', pronunciation: 'sundar' },
    'good': { hi: 'अच्छा', en: 'good', pronunciation: 'accha' },
    'bad': { hi: 'बुरा', en: 'bad', pronunciation: 'bura' },
    'big': { hi: 'बड़ा', en: 'big', pronunciation: 'bada' },
    'small': { hi: 'छोटा', en: 'small', pronunciation: 'chhota' },
    'book': { hi: 'किताब', en: 'book', pronunciation: 'kitaab' },
    'school': { hi: 'स्कूल', en: 'school', pronunciation: 'school' },
    'teacher': { hi: 'शिक्षक', en: 'teacher', pronunciation: 'shikshak' },
    'student': { hi: 'छात्र', en: 'student', pronunciation: 'chhaatra' },
    'mother': { hi: 'माँ', en: 'mother', pronunciation: 'maa' },
    'father': { hi: 'पिता', en: 'father', pronunciation: 'pita' },
    'brother': { hi: 'भाई', en: 'brother', pronunciation: 'bhai' },
    'sister': { hi: 'बहन', en: 'sister', pronunciation: 'bahan' },
    'time': { hi: 'समय', en: 'time', pronunciation: 'samay' },
    'money': { hi: 'पैसा', en: 'money', pronunciation: 'paisa' },
    'work': { hi: 'काम', en: 'work', pronunciation: 'kaam' },
    'help': { hi: 'सहायता', en: 'help', pronunciation: 'sahaayata' },
    'happy': { hi: 'खुश', en: 'happy', pronunciation: 'khush' },
    'sad': { hi: 'उदास', en: 'sad', pronunciation: 'udaas' },
    'नमस्ते': { hi: 'नमस्ते', en: 'hello', pronunciation: 'namaste' },
    'धन्यवाद': { hi: 'धन्यवाद', en: 'thank you', pronunciation: 'dhanyawad' },
    'पानी': { hi: 'पानी', en: 'water', pronunciation: 'paani' },
    'खाना': { hi: 'खाना', en: 'food', pronunciation: 'khaana' },
    'घर': { hi: 'घर', en: 'house', pronunciation: 'ghar' },
    'दोस्त': { hi: 'दोस्त', en: 'friend', pronunciation: 'dost' },
    'अच्छा': { hi: 'अच्छा', en: 'good', pronunciation: 'accha' },
    'बुरा': { hi: 'बुरा', en: 'bad', pronunciation: 'bura' },
    'माँ': { hi: 'माँ', en: 'mother', pronunciation: 'maa' },
    'पिता': { hi: 'पिता', en: 'father', pronunciation: 'pita' }
  };

  const translateText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    
    try {
      const lowerInput = inputText.toLowerCase().trim();
      const translation = commonTranslations[lowerInput];
      
      if (translation) {
        if (fromLanguage === 'en') {
          setTranslatedText(translation.hi);
        } else {
          setTranslatedText(translation.en);
        }
        setPronunciation(translation.pronunciation);
        
        toast({
          title: "Translation Complete",
          description: "Word found in dictionary!",
        });
      } else {
        // Fallback message for words not in dictionary
        setTranslatedText('Translation not available in offline dictionary');
        setPronunciation('');
        
        toast({
          title: "Word Not Found",
          description: "This word is not available in the offline dictionary. Try common words like 'hello', 'water', 'food', etc.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
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
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const clearText = () => {
    setInputText('');
    setTranslatedText('');
    setPronunciation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              English-Hindi Dictionary
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Translate between English and Hindi with pronunciation guide. Perfect for learning and communication.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Dictionary Translator
            </CardTitle>
            <CardDescription>
              Enter a word or phrase to get translation and pronunciation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="from-lang">From</Label>
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
                <Label htmlFor="to-lang">To</Label>
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

            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="input-text">
                  {fromLanguage === 'en' ? 'English Text' : 'हिंदी Text'}
                </Label>
                <div className="relative">
                  <Input
                    id="input-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={fromLanguage === 'en' ? 'Enter English text...' : 'हिंदी टेक्स्ट डालें...'}
                    className="pr-10"
                    onKeyPress={(e) => e.key === 'Enter' && translateText()}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="output-text">
                  {toLanguage === 'en' ? 'English Translation' : 'हिंदी अनुवाद'}
                </Label>
                <div className="relative">
                  <Input
                    id="output-text"
                    value={translatedText}
                    readOnly
                    placeholder="Translation will appear here..."
                    className="pr-10 bg-gray-50"
                  />
                  {translatedText && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => speakText(translatedText, toLanguage)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Pronunciation Section */}
            {pronunciation && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-blue-800 font-medium">Pronunciation:</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-mono text-blue-700">{pronunciation}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(pronunciation, 'en')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={translateText}
                disabled={isTranslating || !inputText.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isTranslating ? 'Translating...' : 'Translate'}
              </Button>
              <Button
                variant="outline"
                onClick={clearText}
                disabled={!inputText && !translatedText}
              >
                Clear
              </Button>
            </div>

            {/* Sample Words */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-gray-800">Try these common words:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {['hello', 'thank you', 'water', 'food', 'family', 'friend', 'good', 'beautiful'].map((word) => (
                  <button
                    key={word}
                    onClick={() => setInputText(word)}
                    className="text-left p-2 hover:bg-white rounded border border-gray-200 transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dictionary;
