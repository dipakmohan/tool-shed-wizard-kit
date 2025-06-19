
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, Loader2, Presentation } from 'lucide-react';

const PptToPdf = () => {
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PowerPoint file (.ppt, .pptx).",
          variant: "destructive",
        });
        return;
      }
      setPptFile(file);
      setPdfUrl('');
    }
  };
  
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  const handleConvert = useCallback(async () => {
    if (!pptFile) {
      toast({ title: "No File Selected", description: "Please upload a PowerPoint file first.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    // Simulate conversion process
    setTimeout(() => {
      toast({
        title: "Feature Coming Soon",
        description: "PPT to PDF conversion is currently under development. This feature will be available soon!",
        variant: "default"
      });
      setIsProcessing(false);
    }, 2000);
  }, [pptFile, toast]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${pptFile?.name.replace(/\.[^/.]+$/, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">PowerPoint to PDF</h1>
        <p className="text-muted-foreground">Convert PowerPoint presentations to PDF format.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <CardHeader>
          <CardTitle>1. Upload PowerPoint File</CardTitle>
          <CardDescription>Drag & drop or select a PowerPoint file (.ppt, .pptx).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" 
              onChange={(e) => handleFileChange(e.target.files)} 
            />
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <Presentation className="w-12 h-12" />
              {pptFile ? <p>{pptFile.name}</p> : <p>Drag 'n' drop a PowerPoint file here, or click to select</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConvert} disabled={!pptFile || isProcessing} className="w-full">
            {isProcessing ? <Loader2 className="animate-spin" /> : <FileUp />}
            {isProcessing ? 'Converting...' : 'Convert to PDF'}
          </Button>
        </CardFooter>
      </Card>

      {pdfUrl && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>2. Download PDF</CardTitle>
            <CardDescription>Your PDF is ready for download.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleDownload} className="w-full">
              <Download />
              Download PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PptToPdf;
