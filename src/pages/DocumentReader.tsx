
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Upload, Play, Pause, Square, Volume2, FileText, Download } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DocumentReader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState([1]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ];

  useEffect(() => {
    if (extractedText) {
      const wordArray = extractedText.split(/\s+/).filter(word => word.length > 0);
      setWords(wordArray);
      setTotalCharacters(extractedText.length);
    }
  }, [extractedText]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!supportedFormats.includes(selectedFile.type)) {
        toast({
          title: "Unsupported File Format",
          description: "Please upload a PDF, Word document, or text file.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      extractTextFromFile(selectedFile);
    }
  };

  const extractTextFromFile = async (file: File) => {
    setIsExtracting(true);
    setExtractedText('');
    setCurrentPosition(0);
    setCurrentWordIndex(0);

    try {
      let text = '';

      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractTextFromDocx(file);
      } else if (file.type === 'text/plain') {
        text = await file.text();
      }

      if (text.trim()) {
        setExtractedText(text);
        toast({
          title: "Text Extracted Successfully",
          description: `Extracted ${text.length} characters from the document.`,
        });
      } else {
        toast({
          title: "No Text Found",
          description: "The document appears to be empty or contains no readable text.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        title: "Extraction Error",
        description: "Failed to extract text from the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const startReading = () => {
    if (!extractedText) {
      toast({
        title: "No Text to Read",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      // Stop any existing speech
      speechSynthesis.cancel();

      const textToRead = extractedText.substring(currentPosition);
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = readingSpeed[0];
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsReading(true);
        setIsPaused(false);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const currentChar = currentPosition + event.charIndex;
          setCurrentPosition(currentChar);
          
          // Update current word index
          const textUpToNow = extractedText.substring(0, currentChar);
          const currentWords = textUpToNow.split(/\s+/).filter(word => word.length > 0);
          setCurrentWordIndex(currentWords.length - 1);
        }
      };

      utterance.onend = () => {
        setIsReading(false);
        setIsPaused(false);
        setCurrentPosition(extractedText.length);
        setCurrentWordIndex(words.length - 1);
        toast({
          title: "Reading Complete",
          description: "Finished reading the document.",
        });
      };

      utterance.onerror = () => {
        setIsReading(false);
        setIsPaused(false);
        toast({
          title: "Speech Error",
          description: "An error occurred while reading the document.",
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

  const pauseReading = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeReading = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentPosition(0);
    setCurrentWordIndex(0);
  };

  const handleSpeedChange = (value: number[]) => {
    setReadingSpeed(value);
    if (isReading && utteranceRef.current) {
      // Restart with new speed
      const wasPlaying = !isPaused;
      stopReading();
      if (wasPlaying) {
        setTimeout(() => startReading(), 100);
      }
    }
  };

  const getProgressPercentage = () => {
    if (totalCharacters === 0) return 0;
    return (currentPosition / totalCharacters) * 100;
  };

  const getHighlightedText = () => {
    if (!extractedText || words.length === 0) return extractedText;
    
    return words.map((word, index) => (
      <span
        key={index}
        className={index === currentWordIndex ? 'bg-yellow-200 font-bold' : ''}
      >
        {word}{' '}
      </span>
    ));
  };

  const downloadText = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name || 'document'}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">PDF & Document Reader</h1>
        <p className="text-muted-foreground">Upload documents and have them read aloud at your preferred speed</p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Supported formats: PDF, Word (.docx), and Text files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">
                {file ? file.name : 'Click to upload a document'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Or drag and drop your file here
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reading Controls */}
      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle>Reading Controls</CardTitle>
            <CardDescription>Control playback and reading speed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reading Speed: {readingSpeed[0]}x
              </label>
              <Slider
                value={readingSpeed}
                onValueChange={handleSpeedChange}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5x (Slower)</span>
                <span>2x (Faster)</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2 justify-center">
              {!isReading ? (
                <Button onClick={startReading} size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Reading
                </Button>
              ) : (
                <>
                  {!isPaused ? (
                    <Button onClick={pauseReading} size="lg">
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeReading} size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={stopReading} variant="outline" size="lg">
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text */}
      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle>Document Content</CardTitle>
            <CardDescription>
              {isExtracting ? 'Extracting text...' : `${extractedText.length} characters extracted`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={downloadText} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Text
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50">
              {isExtracting ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3">Extracting text...</span>
                </div>
              ) : (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {isReading ? getHighlightedText() : extractedText}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentReader;
