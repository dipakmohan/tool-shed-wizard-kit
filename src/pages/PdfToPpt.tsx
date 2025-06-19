
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, Loader2, Presentation } from 'lucide-react';

const PdfToPpt = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pptUrl, setPptUrl] = useState<string>('');
  const { toast } = useToast();

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
      setPptUrl('');
    }
  };
  
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  const handleConvert = useCallback(async () => {
    if (!pdfFile) {
      toast({ title: "No PDF Selected", description: "Please upload a PDF file first.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    // Simulate conversion process
    setTimeout(() => {
      toast({
        title: "Feature Coming Soon",
        description: "PDF to PowerPoint conversion is currently under development. This feature will be available soon!",
        variant: "default"
      });
      setIsProcessing(false);
    }, 2000);
  }, [pdfFile, toast]);

  const handleDownload = () => {
    if (pptUrl) {
      const link = document.createElement('a');
      link.href = pptUrl;
      link.download = `${pdfFile?.name.replace('.pdf', '')}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">PDF to PowerPoint</h1>
        <p className="text-muted-foreground">Convert PDF files to PowerPoint presentations.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <CardHeader>
          <CardTitle>1. Upload PDF</CardTitle>
          <CardDescription>Drag & drop or select a PDF file to convert to PowerPoint.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf" onChange={(e) => handleFileChange(e.target.files)} />
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <FileUp className="w-12 h-12" />
              {pdfFile ? <p>{pdfFile.name}</p> : <p>Drag 'n' drop a PDF here, or click to select</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConvert} disabled={!pdfFile || isProcessing} className="w-full">
            {isProcessing ? <Loader2 className="animate-spin" /> : <Presentation />}
            {isProcessing ? 'Converting...' : 'Convert to PowerPoint'}
          </Button>
        </CardFooter>
      </Card>

      {pptUrl && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>2. Download PowerPoint</CardTitle>
            <CardDescription>Your PowerPoint file is ready for download.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleDownload} className="w-full">
              <Download />
              Download PowerPoint File
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PdfToPpt;
