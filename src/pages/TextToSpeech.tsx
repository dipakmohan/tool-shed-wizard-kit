
import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Download, Volume2, FileAudio, Copy } from 'lucide-react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [voiceGender, setVoiceGender] = useState('female');
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'en-IN', name: 'Hinglish (English-India)', flag: '🇮🇳' },
  ];

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  const getVoices = () => {
    const voices = speechSynthesis.getVoices();
    return voices.filter(voice => {
      const isCorrectLang = voice.lang.startsWith(language.split('-')[0]);
      const matchesGender = voiceGender === 'female' 
        ? voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('susan') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('zira') ||
          !voice.name.toLowerCase().includes('male')
        : voice.name.toLowerCase().includes('male') || 
          voice.name.toLowerCase().includes('man') ||
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('mark') ||
          voice.name.toLowerCase().includes('alex');
      return isCorrectLang && matchesGender;
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start audio recording for download feature.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const speak = async () => {
    if (!text.trim()) {
      toast({
        title: "No Text to Convert",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (wordCount > 10000) {
      toast({
        title: "Text Too Long",
        description: "Please limit your text to 10,000 words or less.",
        variant: "destructive",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      // Stop any existing speech
      speechSynthesis.cancel();
      
      setIsConverting(true);
      await startRecording();

      const voices = getVoices();
      const selectedVoice = voices.length > 0 ? voices[0] : null;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = speed[0];
      utterance.pitch = pitch[0];
      utterance.volume = 1;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setIsConverting(false);
        toast({
          title: "Conversion Started",
          description: "Text-to-speech conversion is in progress.",
        });
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        stopRecording();
        toast({
          title: "Conversion Complete",
          description: "Text has been converted to speech. You can now download the audio file.",
        });
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        setIsPaused(false);
        setIsConverting(false);
        stopRecording();
        toast({
          title: "Conversion Error",
          description: "An error occurred during text-to-speech conversion.",
          variant: "destructive",
        });
      };

      speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    } else {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      });
    }
  };

  const pauseSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    stopRecording();
  };

  const downloadAudio = () => {
    if (!audioBlob) {
      toast({
        title: "No Audio to Download",
        description: "Please convert text to speech first.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-to-speech-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your audio file is being downloaded.",
    });
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text Copied",
      description: "Text has been copied to clipboard.",
    });
  };

  const clearText = () => {
    setText('');
    setAudioBlob(null);
    stopSpeech();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Text to Speech Converter</h1>
        <p className="text-muted-foreground">Convert text to speech in multiple languages with downloadable audio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Settings</CardTitle>
            <CardDescription>Configure language, voice, and speech parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Voice Gender</label>
              <Select value={voiceGender} onValueChange={setVoiceGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female Voice</SelectItem>
                  <SelectItem value="male">Male Voice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Speed: {speed[0].toFixed(1)}x
              </label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Pitch: {pitch[0].toFixed(1)}
              </label>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Playback Controls</CardTitle>
            <CardDescription>Control speech playback and download audio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 justify-center flex-wrap">
              {!isPlaying ? (
                <Button onClick={speak} disabled={isConverting} size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  {isConverting ? 'Converting...' : 'Start'}
                </Button>
              ) : (
                <>
                  {!isPaused ? (
                    <Button onClick={pauseSpeech} size="lg">
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeSpeech} size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={stopSpeech} variant="outline" size="lg">
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button 
                onClick={downloadAudio} 
                disabled={!audioBlob}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download WAV
              </Button>
              <Button onClick={copyText} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </Button>
              <Button onClick={clearText} variant="outline">
                Clear All
              </Button>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileAudio className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {audioBlob ? 'Audio ready for download' : 'Convert text to generate audio'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle>Text Input</CardTitle>
          <CardDescription>
            Enter your text (up to 10,000 words) - Current: {wordCount} words, {charCount} characters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here... You can write in English, Hindi, or mix both languages (Hinglish)."
            className="min-h-[200px] text-base"
            maxLength={50000}
          />
          {wordCount > 10000 && (
            <p className="text-red-500 text-sm mt-2">
              Warning: Text exceeds 10,000 words limit. Please reduce the text length.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sample Texts */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Texts</CardTitle>
          <CardDescription>Try these sample texts in different languages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => setText("Hello! This is a sample English text for text-to-speech conversion. You can use this tool to convert any text into natural-sounding speech with different voices and languages.")}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium">🇺🇸 English Sample</div>
                <div className="text-xs text-muted-foreground">Click to use</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setText("नमस्ते! यह हिंदी भाषा में टेक्स्ट टू स्पीच का एक नमूना है। आप इस उपकरण का उपयोग करके किसी भी हिंदी पाठ को प्राकृतिक आवाज़ में बदल सकते हैं।")}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium">🇮🇳 Hindi Sample</div>
                <div className="text-xs text-muted-foreground">Click to use</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setText("Hello friends! Aaj हम सीखेंगे text-to-speech का use करना। यह tool बहुत useful है for students और professionals. आप English और Hindi दोनों में बात कर सकते हैं।")}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium">🇮🇳 Hinglish Sample</div>
                <div className="text-xs text-muted-foreground">Click to use</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToSpeech;
