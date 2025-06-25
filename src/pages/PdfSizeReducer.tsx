
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FileUp, Download, Loader2, FileText, Minimize2 } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';

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

  const handleCompress = useCallback(async () => {
    if (!pdfFile) {
      toast({ title: "No PDF Selected", description: "Please upload a PDF file first.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      console.log('Original PDF size:', originalSize);
      console.log('Compression level:', compressionLevel[0]);
      
      // Remove metadata to reduce size
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      
      // Get compression quality based on slider (invert so lower slider = more compression)
      const quality = compressionLevel[0] / 100;
      
      // More aggressive compression settings
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false
      });
      
      console.log('After pdf-lib compression:', pdfBytes.length);
      
      // Additional compression by creating a new PDF with reduced quality
      let finalBytes = pdfBytes;
      
      // If we want more aggressive compression, recreate the PDF
      if (quality < 0.8) {
        try {
          const compressedDoc = await PDFDocument.create();
          const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
          
          pages.forEach((page) => {
            // Scale down pages slightly for more compression
            const { width, height } = page.getSize();
            const scaleFactor = Math.max(0.7, quality);
            page.scaleContent(scaleFactor, scaleFactor);
            page.setSize(width * scaleFactor, height * scaleFactor);
            compressedDoc.addPage(page);
          });
          
          finalBytes = await compressedDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: Math.floor(quality * 100),
            updateFieldAppearances: false
          });
          
          console.log('After aggressive compression:', finalBytes.length);
        } catch (error) {
          console.log('Aggressive compression failed, using basic compression');
        }
      }
      
      // If still not compressed enough, try data compression
      if (finalBytes.length > originalSize * (quality + 0.1)) {
        // Create a smaller version by removing some optional elements
        try {
          const minimalDoc = await PDFDocument.create();
          const sourcePages = await minimalDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
          
          sourcePages.forEach(page => {
            minimalDoc.addPage(page);
          });
          
          finalBytes = await minimalDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 20
          });
          
          console.log('After minimal compression:', finalBytes.length);
        } catch (error) {
          console.log('Minimal compression failed');
        }
      }
      
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCompressedPdfUrl(url);
      setCompressedSize(finalBytes.length);

      const actualReduction = ((originalSize - finalBytes.length) / originalSize * 100);
      
      if (finalBytes.length < originalSize) {
        toast({
          title: "Success!",
          description: `PDF compressed successfully. Size reduced by ${actualReduction.toFixed(1)}%.`,
        });
      } else {
        toast({
          title: "Compression Complete",
          description: "PDF processed, but size reduction was minimal. This PDF may already be optimized.",
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
                  min={30}
                  max={95}
                  step={5}
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Maximum Compression (30%)</span>
                  <span>Best Quality (95%)</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Lower values = smaller file size but potentially lower quality</p>
                <p>Higher values = better quality but larger file size</p>
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
                  This PDF appears to be already optimized. Minimal compression achieved.
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
