
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ImageToText from "./pages/ImageToText";
import ImageCompressor from "./pages/ImageCompressor";
import PdfTools from "./pages/PdfTools";
import PdfMerger from "./pages/PdfMerger";
import InvestmentCalculator from "./pages/InvestmentCalculator";
import TaxCalculator from "./pages/TaxCalculator";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UnitConverter from "./pages/UnitConverter";
import LoanCalculator from "./pages/LoanCalculator";
import CameraScanner from "./pages/CameraScanner";
import ExcelToPdf from "./pages/ExcelToPdf";
import PdfToExcel from "./pages/PdfToExcel";
import DatasetGenerator from "./pages/DatasetGenerator";
import PptToPdf from "./pages/PptToPdf";
import PdfToPpt from "./pages/PdfToPpt";
import VoiceToText from "./pages/VoiceToText";
import GstCalculator from "./pages/GstCalculator";
import TypingSpeedTester from "./pages/TypingSpeedTester";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/image-to-text" element={<ImageToText />} />
              <Route path="/voice-to-text" element={<VoiceToText />} />
              <Route path="/image-compressor" element={<ImageCompressor />} />
              <Route path="/pdf-tools" element={<PdfTools />} />
              <Route path="/pdf-merger" element={<PdfMerger />} />
              <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
              <Route path="/pdf-to-excel" element={<PdfToExcel />} />
              <Route path="/ppt-to-pdf" element={<PptToPdf />} />
              <Route path="/pdf-to-ppt" element={<PdfToPpt />} />
              <Route path="/dataset-generator" element={<DatasetGenerator />} />
              <Route path="/investment-calculator" element={<InvestmentCalculator />} />
              <Route path="/tax-calculator" element={<TaxCalculator />} />
              <Route path="/unit-converter" element={<UnitConverter />} />
              <Route path="/loan-calculator" element={<LoanCalculator />} />
              <Route path="/camera-scanner" element={<CameraScanner />} />
              <Route path="/gst-calculator" element={<GstCalculator />} />
              <Route path="/typing-speed-tester" element={<TypingSpeedTester />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
