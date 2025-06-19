
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, Loader2, FileSpreadsheet } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfToExcel = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [excelUrl, setExcelUrl] = useState<string>('');
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
      setExcelUrl('');
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
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const allTextContent: string[][] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items
            .map((item: any) => item.str)
            .filter(text => text.trim() !== '');
          
          if (pageText.length > 0) {
            allTextContent.push([`Page ${i}`, ...pageText]);
          }
        }
        
        if (allTextContent.length === 0) {
          toast({
            title: "No Text Found",
            description: "The PDF doesn't contain extractable text content.",
            variant: "destructive"
          });
          return;
        }
        
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([
          ['Page', 'Content'],
          ...allTextContent
        ]);
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PDF Content');
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = URL.createObjectURL(blob);
        setExcelUrl(url);
        
        toast({ title: "Success!", description: "PDF converted to Excel successfully." });
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not process the PDF file.", variant: "destructive" });
      } finally {
        setIsProcessing(false);
      }
    };
    
    fileReader.readAsArrayBuffer(pdfFile);
  }, [pdfFile, toast]);

  const handleDownload = () => {
    if (excelUrl) {
      const link = document.createElement('a');
      link.href = excelUrl;
      link.download = `${pdfFile?.name.replace('.pdf', '')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">PDF to Excel</h1>
        <p className="text-muted-foreground">Extract text content from PDF files into Excel spreadsheets.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <CardHeader>
          <CardTitle>1. Upload PDF</CardTitle>
          <CardDescription>Drag & drop or select a PDF file to extract text content.</CardDescription>
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
            {isProcessing ? <Loader2 className="animate-spin" /> : <FileSpreadsheet />}
            {isProcessing ? 'Converting...' : 'Convert to Excel'}
          </Button>
        </CardFooter>
      </Card>

      {excelUrl && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>2. Download Excel</CardTitle>
            <CardDescription>Your Excel file is ready for download.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleDownload} className="w-full">
              <Download />
              Download Excel File
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PdfToExcel;
