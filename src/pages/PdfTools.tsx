
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PageImage {
  src: string;
  pageNumber: number;
}

const PdfTools = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
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
      setPageImages([]);
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
    setPageImages([]);
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const images: PageImage[] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if(context){
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            images.push({ src: canvas.toDataURL('image/png'), pageNumber: i });
          }
        }
        setPageImages(images);
        toast({ title: "Success!", description: `Extracted ${images.length} pages from the PDF.` });
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not process the PDF.", variant: "destructive" });
      } finally {
        setIsProcessing(false);
      }
    };
    fileReader.readAsArrayBuffer(pdfFile);
  }, [pdfFile, toast]);

  const handleDownload = (src: string, pageNumber: number) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${pdfFile?.name.replace('.pdf', '')}-page-${pageNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">PDF to Image</h1>
        <p className="text-muted-foreground">Extract each page of a PDF file as a PNG image.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <CardHeader>
          <CardTitle>1. Upload PDF</CardTitle>
          <CardDescription>Drag & drop or select a PDF file.</CardDescription>
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
            {isProcessing ? <Loader2 className="animate-spin" /> : <ImageIcon />}
            {isProcessing ? 'Converting...' : 'Convert to Images'}
          </Button>
        </CardFooter>
      </Card>

      {pageImages.length > 0 && (
         <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>2. Converted Images</CardTitle>
                <CardDescription>Download the extracted images below.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pageImages.map((image) => (
                    <div key={image.pageNumber} className="relative group border rounded-lg overflow-hidden">
                        <img src={image.src} alt={`Page ${image.pageNumber}`} className="w-full h-auto" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" onClick={() => handleDownload(image.src, image.pageNumber)}>
                                <Download />
                                Page {image.pageNumber}
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
         </Card>
      )}
    </div>
  );
};

export default PdfTools;
