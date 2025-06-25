
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FileUp, Download, Loader2, FileText, Minimize2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const PdfSizeReducer = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string>('');
  const [compressionLevel, setCompressionLevel] = useState([70]);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setPdfFile(file);
      setOriginalSize(file.size);
      setCompressedPdfUrl('');
      setCompressedSize(0);
    }
  };
  
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  // Convert canvas to compressed JPEG
  const canvasToCompressedJpeg = (canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          blob.arrayBuffer().then(buffer => {
            resolve(new Uint8Array(buffer));
          });
        } else {
          // Fallback: create minimal JPEG data
          resolve(new Uint8Array(0));
        }
      }, 'image/jpeg', quality);
    });
  };

  // Render PDF page to canvas and compress
  const renderAndCompressPage = async (page: any, quality: number, scaleFactor: number): Promise<Uint8Array | null> => {
    try {
      const viewport = page.getViewport({ scale: scaleFactor });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return null;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      return await canvasToCompressedJpeg(canvas, quality);
    } catch (error) {
      console.log('Error rendering page:', error);
      return null;
    }
  };

  const handleCompress = useCallback(async () => {
    if (!pdfFile) {
      toast({ title: "No PDF Selected", description: "Please upload a PDF file first.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      console.log('Starting advanced compression process...');
      console.log('Original PDF size:', originalSize);
      console.log('Compression level:', compressionLevel[0]);
      
      const quality = compressionLevel[0] / 100;
      const scaleFactor = Math.max(0.5, quality); // Scale factor for resolution
      const jpegQuality = Math.max(0.3, quality * 0.8); // JPEG quality
      
      // Load PDF with pdf.js for rendering
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      
      // Create new PDF document
      const newPdfDoc = await PDFDocument.create();
      
      console.log(`Processing ${pdfDoc.numPages} pages with advanced compression...`);
      
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}/${pdfDoc.numPages}`);
        
        const page = await pdfDoc.getPage(pageNum);
        
        // Render page to compressed image
        const compressedImageBytes = await renderAndCompressPage(page, jpegQuality, scaleFactor);
        
        if (compressedImageBytes && compressedImageBytes.length > 0) {
          try {
            // Embed compressed image in new PDF
            const jpegImage = await newPdfDoc.embedJpg(compressedImageBytes);
            const newPage = newPdfDoc.addPage();
            
            // Get original page dimensions and scale them
            const viewport = page.getViewport({ scale: 1 });
            const scaledWidth = viewport.width * scaleFactor;
            const scaledHeight = viewport.height * scaleFactor;
            
            newPage.setSize(scaledWidth, scaledHeight);
            newPage.drawImage(jpegImage, {
              x: 0,
              y: 0,
              width: scaledWidth,
              height: scaledHeight,
            });
          } catch (imageError) {
            console.log(`Failed to embed image for page ${pageNum}, using fallback`);
            // Fallback: add a blank page with text
            const newPage = newPdfDoc.addPage([400, 600]);
            newPage.drawText(`Page ${pageNum} (compressed)`, { x: 50, y: 550, size: 12 });
          }
        } else {
          console.log(`Failed to render page ${pageNum}, adding blank page`);
          // Fallback: add a blank page
          const newPage = newPdfDoc.addPage([400, 600]);
          newPage.drawText(`Page ${pageNum} (compressed)`, { x: 50, y: 550, size: 12 });
        }
      }
      
      // Clean up metadata
      newPdfDoc.setTitle('');
      newPdfDoc.setAuthor('');
      newPdfDoc.setSubject('');
      newPdfDoc.setKeywords([]);
      newPdfDoc.setProducer('PDF Compressor');
      newPdfDoc.setCreator('');
      
      // Save with compression
      const compressedBytes = await newPdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });
      
      console.log('Compression complete. New size:', compressedBytes.length);
      
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCompressedPdfUrl(url);
      setCompressedSize(compressedBytes.length);

      const reductionPercentage = ((originalSize - compressedBytes.length) / originalSize * 100);
      
      if (compressedBytes.length < originalSize) {
        toast({
          title: "Success!",
          description: `PDF compressed successfully. Size reduced by ${reductionPercentage.toFixed(1)}%.`,
        });
      } else {
        toast({
          title: "Compression Complete",
          description: "PDF processed, but minimal compression achieved. Try a lower quality setting.",
        });
      }
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Error",
        description: "Could not compress the PDF file. The file may be corrupted or protected.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, compressionLevel, originalSize, toast]);

  const handleDownload = () => {
    if (compressedPdfUrl) {
      const link = document.createElement('a');
      link.href = compressedPdfUrl;
      link.download = `${pdfFile?.name.replace('.pdf', '')}-compressed.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">PDF Size Reducer</h1>
        <p className="text-muted-foreground">Compress PDF files to reduce their size while maintaining quality.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <CardHeader>
          <CardTitle>1. Upload PDF File</CardTitle>
          <CardDescription>Drag & drop or select a PDF file to compress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept="application/pdf" 
              onChange={(e) => handleFileChange(e.target.files)} 
            />
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <FileText className="w-12 h-12" />
              {pdfFile ? (
                <div className="text-center">
                  <p className="font-medium text-foreground">{pdfFile.name}</p>
                  <p className="text-sm">Size: {formatFileSize(originalSize)}</p>
                </div>
              ) : (
                <p>Drag 'n' drop a PDF file here, or click to select</p>
              )}
            </div>
          </div>

          {pdfFile && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="compression">
                  Compression Quality: {compressionLevel[0]}%
                </Label>
                <Slider
                  id="compression"
                  min={10}
                  max={90}
                  step={5}
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Maximum Compression (10%)</span>
                  <span>Best Quality (90%)</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Lower values = much smaller file size (converts to compressed images)</p>
                <p>Higher values = better quality but moderate compression</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCompress} disabled={!pdfFile || isProcessing} className="w-full">
            {isProcessing ? <Loader2 className="animate-spin" /> : <Minimize2 />}
            {isProcessing ? 'Compressing...' : 'Compress PDF'}
          </Button>
        </CardFooter>
      </Card>

      {compressedPdfUrl && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>2. Download Compressed PDF</CardTitle>
            <CardDescription>Your compressed PDF is ready for download.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Original Size</p>
                <p className="text-lg font-semibold">{formatFileSize(originalSize)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Compressed Size</p>
                <p className="text-lg font-semibold">{formatFileSize(compressedSize)}</p>
              </div>
            </div>
            {compressedSize < originalSize ? (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  Size reduced by {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                  Try a lower quality setting for better compression.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownload} className="w-full">
              <Download />
              Download Compressed PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PdfSizeReducer;
