import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Play, Pause, Square, Download, Volume2, FileAudio, Copy, Key, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('pNInz6obpgDQGcFmaJgB'); // Indian English voice
  const [voiceEngine, setVoiceEngine] = useState<'browser' | 'elevenlabs'>('elevenlabs');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  ];

  // ElevenLabs voices with Indian accents
  const elevenLabsVoices = [
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Indian English Male)', gender: 'male', accent: 'Indian' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Indian English Female)', gender: 'female', accent: 'Indian' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Indian English Male)', gender: 'male', accent: 'Indian' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Indian English Female)', gender: 'female', accent: 'Indian' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Indian English Male)', gender: 'male', accent: 'Indian' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Indian English Female)', gender: 'female', accent: 'Indian' },
    { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave (Indian English Male)', gender: 'male', accent: 'Indian' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Indian English Male)', gender: 'male', accent: 'Indian' },
  ];

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  // Filter ElevenLabs voices by gender
  const getFilteredElevenLabsVoices = () => {
    return elevenLabsVoices.filter(voice => voice.gender === voiceGender);
  };

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

  const generateSpeechWithElevenLabs = async () => {
    if (!elevenLabsApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key to use premium voices.",
        variant: "destructive",
      });
      return;
    }

    if (!text.trim()) {
      toast({
        title: "No Text to Convert",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + selectedVoice, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const audioData = await response.arrayBuffer();
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      setAudioBlob(audioBlob);

      // Play the audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setIsConverting(false);
        toast({
          title: "Conversion Complete",
          description: "High-quality speech generated with Indian accent!",
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setIsConverting(false);
        toast({
          title: "Playback Error",
          description: "Error playing the generated audio.",
          variant: "destructive",
        });
      };

      await audio.play();

    } catch (error) {
      console.error('ElevenLabs API Error:', error);
      setIsConverting(false);
      toast({
        title: "Generation Failed",
        description: "Failed to generate speech. Please check your API key and try again.",
        variant: "destructive",
      });
    }
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
    if (voiceEngine === 'elevenlabs') {
      await generateSpeechWithElevenLabs();
      return;
    }

    // Browser TTS fallback code
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
    const extension = voiceEngine === 'elevenlabs' ? 'mp3' : 'wav';
    a.download = `text-to-speech-${Date.now()}.${extension}`;
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
        <p className="text-muted-foreground">Convert text to speech with realistic Indian accents for YouTube videos</p>
      </div>

      {/* Voice Engine Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Voice Quality Selection
          </CardTitle>
          <CardDescription>Choose between premium AI voices or standard browser voices</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={voiceEngine} onValueChange={(value: 'browser' | 'elevenlabs') => setVoiceEngine(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="elevenlabs" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Premium AI Voices (Recommended)
              </TabsTrigger>
              <TabsTrigger value="browser">Standard Browser Voices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elevenlabs" className="mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <h4 className="font-semibold text-blue-900 mb-2">🎯 Perfect for YouTube Videos!</h4>
                  <p className="text-sm text-blue-800">
                    Get realistic Indian English voices with natural intonation, emotion, and perfect pronunciation. 
                    These voices sound like real people, not robotic text readers.
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    ElevenLabs API Key
                  </label>
                  <Input
                    type="password"
                    value={elevenLabsApiKey}
                    onChange={(e) => setElevenLabsApiKey(e.target.value)}
                    placeholder="Enter your ElevenLabs API key..."
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your free API key from{' '}
                    <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      elevenlabs.io
                    </a>
                    . Free tier includes 10,000 characters per month.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Indian Voice</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredElevenLabsVoices().map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <span className="flex items-center gap-2">
                            <span>🇮🇳</span>
                            <span>{voice.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="browser" className="mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Browser voices have limited Indian accent support and may sound robotic. 
                    For YouTube videos, we recommend using Premium AI Voices above.
                  </p>
                </div>
                
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Gender Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Settings</CardTitle>
            <CardDescription>Choose voice gender and characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Playback Controls</CardTitle>
            <CardDescription>Generate and download your audio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 justify-center flex-wrap">
              {!isPlaying ? (
                <Button onClick={speak} disabled={isConverting} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Play className="w-5 h-5 mr-2" />
                  {isConverting ? 'Generating...' : (voiceEngine === 'elevenlabs' ? 'Generate AI Voice' : 'Start')}
                </Button>
              ) : (
                <>
                  {voiceEngine === 'browser' && (
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
                </>
              )}
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button 
                onClick={downloadAudio} 
                disabled={!audioBlob}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download {voiceEngine === 'elevenlabs' ? 'MP3' : 'WAV'}
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
                {audioBlob ? 'Audio ready for download' : 'Generate speech to create audio file'}
              </p>
              {voiceEngine === 'elevenlabs' && (
                <p className="text-xs text-blue-600 mt-1">
                  High-quality MP3 with realistic Indian accent
                </p>
              )}
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
            placeholder="Enter your text here... Write naturally as you would speak for your YouTube video. The AI will make it sound conversational and engaging."
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
          <CardTitle>Sample Texts for YouTube</CardTitle>
          <CardDescription>Try these sample texts optimized for video content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setText("Hello everyone! Welcome back to my channel. Today I'm going to share something really exciting with you. This new text-to-speech tool is perfect for creating professional voiceovers for your YouTube videos. The Indian accent sounds so natural and realistic that your viewers will think it's your actual voice!")}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium">🎥 YouTube Intro Sample</div>
                <div className="text-xs text-muted-foreground">Click to use</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setText("नमस्कार दोस्तों! आज मैं आपके साथ एक बहुत ही उपयोगी टिप शेयर करने जा रहा हूं। यह text-to-speech tool बिल्कुल realistic आवाज़ देता है और आपके YouTube videos के लिए perfect है। आप इसका इस्तेमाल करके professional voiceovers बना सकते हैं।")}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium">🇮🇳 Hindi YouTube Sample</div>
                <div className="text-xs text-muted-foreground">Click to use</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setText("Hey guys! So आज का topic है बहुत interesting. I'm going to show you कैसे आप अपने YouTube videos के लिए realistic voice generate कर सकते हैं. This tool का quality इतना अच्छा है कि आपके viewers को लगेगा कि आप खुद बोल रहे हैं!")}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium">🎯 Hinglish YouTube Sample</div>
                <div className="text-xs text-muted-foreground">Click to use</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setText("Before we dive into today's content, make sure to hit that subscribe button and ring the notification bell. It really helps the channel grow. Now, let's talk about this amazing technology that's changing how we create content. The voice quality is so impressive that even I was surprised when I first heard it!")}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium">📢 Engagement Sample</div>
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
