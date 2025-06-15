
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text, FileUp, Copy, Check } from 'lucide-react';
import Tesseract from 'tesseract.js';

const ImageToText = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (e.g., JPG, PNG).",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setExtractedText('');
      setProgress(0);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  const handleExtractText = useCallback(async () => {
    if (!imageFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setExtractedText('');

    Tesseract.recognize(imageFile, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      },
    }).then(({ data: { text } }) => {
      setExtractedText(text);
      toast({
        title: "Success!",
        description: "Text has been extracted from the image.",
      });
    }).catch((err) => {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not extract text. Please try another image.",
        variant: "destructive",
      });
    }).finally(() => {
      setIsLoading(false);
      setProgress(100);
    });
  }, [imageFile, toast]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Image to Text (OCR)</h1>
        <p className="text-muted-foreground">Extract text from any image with a single click.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card onDragOver={onDragOver} onDrop={onDrop}>
          <CardHeader>
            <CardTitle>1. Upload Image</CardTitle>
            <CardDescription>Drag & drop an image or click to select.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
              {imageUrl ? (
                <img src={imageUrl} alt="Upload preview" className="max-h-64 mx-auto rounded-md" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                  <FileUp className="w-12 h-12" />
                  <p>Drag 'n' drop an image here, or click to select</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExtractText} disabled={!imageFile || isLoading} className="w-full">
              {isLoading ? `Extracting... ${progress}%` : 'Extract Text'}
              {!isLoading && <Text className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Extracted Text</CardTitle>
            <CardDescription>Your extracted text will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {extractedText && (
              <Button size="sm" variant="ghost" className="absolute top-4 right-4 h-8 w-8 p-0" onClick={handleCopyText}>
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
            <div className="bg-muted/50 p-4 rounded-md min-h-64 whitespace-pre-wrap text-sm text-foreground">
              {isLoading && !extractedText && <p className="text-muted-foreground">Processing image...</p>}
              {!isLoading && !extractedText && <p className="text-muted-foreground">Upload an image and click "Extract Text" to begin.</p>}
              {extractedText}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageToText;
