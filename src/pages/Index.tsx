
import ToolCard from "@/components/ToolCard";
import { FileText, Image, FilePdf } from "lucide-react";

const tools = [
  {
    icon: FileText,
    title: "Image to Text",
    description: "Extract text from JPG, PNG, and other image formats.",
    href: "/image-to-text",
  },
  {
    icon: Image,
    title: "Image Compressor",
    description: "Reduce the file size of your images without losing quality.",
    href: "/image-compressor",
  },
  {
    icon: FilePdf,
    title: "PDF Tools",
    description: "Convert, merge, and edit PDF files with ease.",
    href: "/pdf-tools",
  },
];

const Index = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in">Your All-in-One Digital Toolkit</h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
        Quickly and easily convert, compress, and edit your files with our suite of powerful online tools.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
