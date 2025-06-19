
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Volume2, Copy, Download, Languages } from 'lucide-react';

const VoiceToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en-US');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const languages = [
    { code: 'en-US', name: 'English (US)', translate: 'en' },
    { code: 'es-ES', name: 'Spanish', translate: 'es' },
    { code: 'fr-FR', name: 'French', translate: 'fr' },
    { code: 'de-DE', name: 'German', translate: 'de' },
    { code: 'it-IT', name: 'Italian', translate: 'it' },
    { code: 'pt-PT', name: 'Portuguese', translate: 'pt' },
    { code: 'ru-RU', name: 'Russian', translate: 'ru' },
    { code: 'ja-JP', name: 'Japanese', translate: 'ja' },
    { code: 'ko-KR', name: 'Korean', translate: 'ko' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', translate: 'zh' },
    { code: 'ar-SA', name: 'Arabic', translate: 'ar' },
    { code: 'hi-IN', name: 'Hindi', translate: 'hi' },
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLanguage;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLanguage, toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = sourceLanguage;
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening Started",
        description: "Speak now, your voice will be converted to text.",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Listening Stopped",
        description: "Voice recording has been stopped.",
      });
    }
  };

  const translateText = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No Text to Translate",
        description: "Please record some speech first.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      // Using Google Translate API (free tier) - In production, you'd want to use a proper API key
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${languages.find(l => l.code === sourceLanguage)?.translate || 'en'}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(transcript)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const translated = data[0]?.map((item: any) => item[0]).join('') || '';
        setTranslatedText(translated);
        toast({
          title: "Translation Complete",
          description: "Text has been successfully translated.",
        });
      } else {
        throw new Error('Translation failed');
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

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: "Failed to read the text aloud.",
          variant: "destructive",
        });
      };

      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setTranscript('');
    setTranslatedText('');
    toast({
      title: "Cleared",
      description: "All text has been cleared.",
    });
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Voice to Text Converter</h1>
        <p className="text-muted-foreground">Convert speech to text with multi-language support and translation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
            <CardDescription>Select source and target languages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Source Language (Speech Input)</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target Language (Translation)</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.translate} value={lang.translate}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Voice Recording */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Recording</CardTitle>
            <CardDescription>Click to start/stop recording your voice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                className={`w-32 h-32 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
              >
                {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {isListening ? 'Listening... Click to stop' : 'Click to start recording'}
            </p>
            <Button onClick={clearAll} variant="outline" className="w-full">
              Clear All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Original Text */}
      {transcript && (
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>Speech converted to text in {languages.find(l => l.code === sourceLanguage)?.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your speech will appear here..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => speakText(transcript, sourceLanguage)} disabled={isSpeaking}>
                <Volume2 className="w-4 h-4 mr-2" />
                Read Aloud
              </Button>
              <Button onClick={() => copyToClipboard(transcript)} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={() => downloadText(transcript, 'original-text.txt')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={translateText} disabled={isTranslating || !transcript.trim()}>
                <Languages className="w-4 h-4 mr-2" />
                {isTranslating ? 'Translating...' : 'Translate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Translated Text */}
      {translatedText && (
        <Card>
          <CardHeader>
            <CardTitle>Translated Text</CardTitle>
            <CardDescription>Text translated to {languages.find(l => l.translate === targetLanguage)?.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={translatedText}
              onChange={(e) => setTranslatedText(e.target.value)}
              placeholder="Translated text will appear here..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => speakText(translatedText, languages.find(l => l.translate === targetLanguage)?.code || 'en-US')} 
                disabled={isSpeaking}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Read Aloud
              </Button>
              <Button onClick={() => copyToClipboard(translatedText)} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={() => downloadText(translatedText, 'translated-text.txt')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceToText;
