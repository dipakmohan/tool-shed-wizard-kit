
import { Link } from "react-router-dom";
import { FileUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-0 h-auto">
                PDF Tools <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/pdf-tools">PDF to Image</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/pdf-merger">Merge PDFs</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-0 h-auto">
                Calculators <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/loan-calculator">Loan Calculator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/investment-calculator">Investment Calculator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tax-calculator">Tax Calculator</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/unit-converter" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Unit Converter</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
