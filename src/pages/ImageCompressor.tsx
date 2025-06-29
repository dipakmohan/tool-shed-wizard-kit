
import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FileUp, Download, Image as ImageIcon, Loader2 } from 'lucide-react';

const ImageCompressor = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [quality, setQuality] = useState(70);
  const { toast } = useToast();

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

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
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl(null);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  const handleCompressImage = useCallback(async () => {
    if (!originalFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file first.",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setCompressedFile(null);
    setCompressedUrl(null);

    console.log('Starting compression with quality:', quality);
    console.log('Original file size:', originalFile.size);

    const options = {
      maxSizeMB: Math.max(0.1, (originalFile.size / 1024 / 1024) * (quality / 100)),
      maxWidthOrHeight: quality < 50 ? 1024 : quality < 80 ? 1920 : 2560,
      useWebWorker: true,
      quality: quality / 100,
      fileType: originalFile.type as 'image/jpeg' | 'image/png' | 'image/webp',
    };

    console.log('Compression options:', options);

    try {
      const compressed = await imageCompression(originalFile, options);
      console.log('Compressed file size:', compressed.size);
      
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
      
      const compressionRatio = Math.round(100 - (compressed.size / originalFile.size) * 100);
      
      if (compressed.size >= originalFile.size * 0.95) {
        toast({
          title: "Image Processed",
          description: "Could not reduce file size significantly. The image may already be optimized or try reducing quality further.",
        });
      } else {
        toast({
          title: "Success!",
          description: `Image compressed by ${compressionRatio}%. Size reduced from ${formatBytes(originalFile.size)} to ${formatBytes(compressed.size)}.`,
        });
      }
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression Error",
        description: "Could not compress the image. Please try another one or adjust the quality settings.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  }, [originalFile, quality, toast]);

  const handleDownload = () => {
    if (compressedUrl && compressedFile && originalFile) {
      const link = document.createElement('a');
      link.href = compressedUrl;
      const fileExtension = originalFile.name.split('.').pop();
      const baseName = originalFile.name.replace(`.${fileExtension}`, '');
      link.download = `${baseName}_compressed_${quality}%.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Image Compressor</h1>
        <p className="text-muted-foreground">Reduce image file sizes with adjustable quality settings.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card onDragOver={onDragOver} onDrop={onDrop}>
          <CardHeader>
            <CardTitle>1. Upload & Configure</CardTitle>
            <CardDescription>Drag & drop or select an image to compress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
              {originalUrl ? (
                <img src={originalUrl} alt="Original" className="max-h-60 mx-auto rounded-md" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                  <FileUp className="w-12 h-12" />
                  <p>Drag 'n' drop an image here, or click to select</p>
                </div>
              )}
            </div>
            {originalFile && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-center text-muted-foreground">Original size: {formatBytes(originalFile.size)}</p>
                <div>
                  <Label htmlFor="quality" className="mb-2 flex justify-between">
                    <span>Compression Quality</span>
                    <span>{quality}%</span>
                  </Label>
                  <Slider 
                    id="quality" 
                    defaultValue={[quality]} 
                    min={10}
                    max={95} 
                    step={5} 
                    onValueChange={(value) => setQuality(value[0])} 
                    disabled={isCompressing} 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Higher compression</span>
                    <span>Better quality</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleCompressImage} disabled={!originalFile || isCompressing} className="w-full">
              {isCompressing ? <Loader2 className="animate-spin" /> : <ImageIcon />}
              {isCompressing ? 'Compressing...' : 'Compress Image'}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Compressed Image</CardTitle>
            <CardDescription>Your compressed image will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {compressedUrl ? (
              <img src={compressedUrl} alt="Compressed" className="max-h-60 mx-auto rounded-md" />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>{isCompressing ? "Processing..." : "Waiting for compression..."}</p>
              </div>
            )}
          </CardContent>
          {compressedFile && originalFile && (
            <CardFooter className="flex-col gap-4">
               {compressedFile.size < originalFile.size * 0.95 ? (
                 <p className="text-sm text-center text-green-600 dark:text-green-500 font-medium">
                    New size: {formatBytes(compressedFile.size)} ({Math.round(100 - (compressedFile.size / originalFile.size) * 100)}% smaller)
                  </p>
               ) : (
                 <p className="text-sm text-center text-muted-foreground">
                    New size: {formatBytes(compressedFile.size)}. Minimal reduction achieved.
                 </p>
               )}
              <Button onClick={handleDownload} className="w-full">
                <Download />
                Download Compressed Image
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ImageCompressor;
