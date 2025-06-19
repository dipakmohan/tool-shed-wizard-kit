
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, Loader2, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExcelToPdf = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an Excel file (.xlsx, .xls) or CSV file.",
          variant: "destructive",
        });
        return;
      }
      setExcelFile(file);
      setPdfUrl('');
    }
  };
  
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  const handleConvert = useCallback(async () => {
    if (!excelFile) {
      toast({ title: "No File Selected", description: "Please upload an Excel file first.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const pdf = new jsPDF();
        let isFirstSheet = true;
        
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (!isFirstSheet) {
            pdf.addPage();
          }
          
          pdf.setFontSize(16);
          pdf.text(sheetName, 14, 20);
          
          if (jsonData.length > 0) {
            const tableData = jsonData.map((row: any) => 
              Array.isArray(row) ? row.map(cell => cell?.toString() || '') : []
            ).filter(row => row.length > 0);
            
            if (tableData.length > 0) {
              (pdf as any).autoTable({
                head: [tableData[0]],
                body: tableData.slice(1),
                startY: 30,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] },
                margin: { top: 30 }
              });
            }
          }
          
          isFirstSheet = false;
        });
        
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        
        toast({ title: "Success!", description: "Excel file converted to PDF successfully." });
      };
      
      fileReader.readAsArrayBuffer(excelFile);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Could not convert the Excel file.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [excelFile, toast]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${excelFile?.name.replace(/\.[^/.]+$/, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Excel to PDF</h1>
        <p className="text-muted-foreground">Convert Excel spreadsheets to PDF format.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <CardHeader>
          <CardTitle>1. Upload Excel File</CardTitle>
          <CardDescription>Drag & drop or select an Excel file (.xlsx, .xls, .csv).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" 
              onChange={(e) => handleFileChange(e.target.files)} 
            />
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <FileSpreadsheet className="w-12 h-12" />
              {excelFile ? <p>{excelFile.name}</p> : <p>Drag 'n' drop an Excel file here, or click to select</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConvert} disabled={!excelFile || isProcessing} className="w-full">
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

export default ExcelToPdf;
