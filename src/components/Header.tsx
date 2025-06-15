
import { Link } from "react-router-dom";
import { FileUp } from "lucide-react";

const Header = () => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-card border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <FileUp className="h-6 w-6" />
          <span>Toolkit</span>
        </Link>
        <nav className="hidden md:flex flex-wrap gap-4">
          <Link to="/image-to-text" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Image to Text</Link>
          <Link to="/image-compressor" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Image Compressor</Link>
          <Link to="/pdf-tools" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">PDF Tools</Link>
          <Link to="/unit-converter" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Unit Converter</Link>
          <Link to="/loan-calculator" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Loan Calculator</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
