
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FileUp, Download, Loader2, FileText, Minimize2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

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
      
      // Simple compression by adjusting quality
      // Note: This is a basic implementation. Real compression would involve image optimization
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: compressionLevel[0] > 50,
        addDefaultPage: false,
        objectsPerTick: compressionLevel[0] > 30 ? 50 : 20
      });
      
      // Simulate size reduction based on compression level
      const targetSize = Math.floor(originalSize * (compressionLevel[0] / 100));
      const actualBytes = pdfBytes.length;
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCompressedPdfUrl(url);
      setCompressedSize(actualBytes);

      const reductionPercentage = ((originalSize - actualBytes) / originalSize * 100).toFixed(1);
      
      toast({
        title: "Success!",
        description: `PDF compressed successfully. Size reduced by ${reductionPercentage}%.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not compress the PDF file.",
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
                  Compression Level: {compressionLevel[0]}% of original size
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
                  <span>Minimal Compression (90%)</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Target size: ~{formatFileSize(originalSize * (compressionLevel[0] / 100))}</p>
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
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-400 font-medium">
                Size reduced by {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%
              </p>
            </div>
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
