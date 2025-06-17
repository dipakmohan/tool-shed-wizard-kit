
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, Loader2, X, Plus } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PdfFile {
  file: File;
  id: string;
}

const PdfMerger = () => {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const validFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid Files",
          description: "Only PDF files are allowed.",
          variant: "destructive",
        });
      }
      
      const newPdfFiles = validFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9)
      }));
      
      setPdfFiles(prev => [...prev, ...newPdfFiles]);
    }
  };

  const removePdf = (id: string) => {
    setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  const handleMerge = useCallback(async () => {
    if (pdfFiles.length < 2) {
      toast({
        title: "Not Enough Files",
        description: "Please upload at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);

      toast({
        title: "Success!",
        description: `Successfully merged ${pdfFiles.length} PDF files.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not merge the PDF files.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFiles, toast]);

  const handleDownload = () => {
    if (mergedPdfUrl) {
      const link = document.createElement('a');
      link.href = mergedPdfUrl;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">PDF Merger</h1>
        <p className="text-muted-foreground">Combine multiple PDF files into a single document.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <CardHeader>
          <CardTitle>1. Upload PDF Files</CardTitle>
          <CardDescription>Add multiple PDF files to merge them into one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept="application/pdf" 
              multiple
              onChange={(e) => handleFileChange(e.target.files)} 
            />
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <Plus className="w-12 h-12" />
              <p>Drag 'n' drop PDF files here, or click to select</p>
            </div>
          </div>

          {pdfFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Selected Files ({pdfFiles.length}):</h3>
              {pdfFiles.map((pdfFile) => (
                <div key={pdfFile.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm truncate">{pdfFile.file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePdf(pdfFile.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleMerge} 
            disabled={pdfFiles.length < 2 || isProcessing} 
            className="w-full"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <FileUp />}
            {isProcessing ? 'Merging...' : 'Merge PDFs'}
          </Button>
        </CardFooter>
      </Card>

      {mergedPdfUrl && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>2. Download Merged PDF</CardTitle>
            <CardDescription>Your merged PDF is ready for download.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleDownload} className="w-full">
              <Download />
              Download Merged PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PdfMerger;
