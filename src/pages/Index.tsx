
import ToolCard from "@/components/ToolCard";
import { FileText, Image, File, Calculator, Currency, FilePlus, PiggyBank, Receipt, Scan, FileSpreadsheet, Database } from "lucide-react";

const tools = [
  {
    icon: Scan,
    title: "Camera Scanner",
    description: "AI-powered scanner for math, biology, landmarks, and more using your camera.",
    href: "/camera-scanner",
    color: "gradient" as const,
  },
  {
    icon: FileText,
    title: "Image to Text",
    description: "Extract text from JPG, PNG, and other image formats.",
    href: "/image-to-text",
    color: "primary" as const,
  },
  {
    icon: Image,
    title: "Image Compressor",
    description: "Reduce the file size of your images without losing quality.",
    href: "/image-compressor",
    color: "green" as const,
  },
  {
    icon: File,
    title: "PDF to Image",
    description: "Extract pages from a PDF as images.",
    href: "/pdf-tools",
    color: "yellow" as const,
  },
  {
    icon: FilePlus,
    title: "PDF Merger",
    description: "Combine multiple PDF files into a single document.",
    href: "/pdf-merger",
    color: "yellow" as const,
  },
  {
    icon: FileSpreadsheet,
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF format.",
    href: "/excel-to-pdf",
    color: "green" as const,
  },
  {
    icon: FileSpreadsheet,
    title: "PDF to Excel",
    description: "Extract data from PDF files into Excel spreadsheets.",
    href: "/pdf-to-excel",
    color: "purple" as const,
  },
  {
    icon: Database,
    title: "Dataset Generator",
    description: "Generate custom datasets with various data types and configurations.",
    href: "/dataset-generator",
    color: "accent" as const,
  },
  {
    icon: Calculator,
    title: "Unit Converter",
    description: "Quickly convert between different units of measurement.",
    href: "/unit-converter",
    color: "purple" as const,
  },
  {
    icon: Currency,
    title: "Loan Calculator",
    description: "Estimate your monthly loan payments.",
    href: "/loan-calculator",
    color: "accent" as const,
  },
  {
    icon: PiggyBank,
    title: "Investment Calculator",
    description: "Calculate FD, RD, and NSC maturity values.",
    href: "/investment-calculator",
    color: "green" as const,
  },
  {
    icon: Receipt,
    title: "Tax Calculator",
    description: "Calculate income tax under Indian law (New & Old regime).",
    href: "/tax-calculator",
    color: "primary" as const,
  },
];

const Index = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">
        Your All-in-One Digital Toolkit
      </h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
        Quickly and easily convert, compress, and edit your files with our suite of powerful online tools. Now with AI-powered camera scanning!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tools.map((tool, index) => (
          <ToolCard
            key={tool.href}
            {...tool}
            animationDelay={`${index * 0.1 + 0.2}s`}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
