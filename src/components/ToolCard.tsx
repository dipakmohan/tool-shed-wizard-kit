
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  animationDelay: string;
}

const ToolCard = ({ icon: Icon, title, description, href, animationDelay }: ToolCardProps) => {
  return (
    <Link to={href} className="block group animate-fade-in" style={{ animationDelay }}>
      <Card className="h-full hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="flex flex-col items-center text-center p-6">
          <div className="p-3 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-colors duration-300">
            <Icon className="h-8 w-8 text-primary transition-colors duration-300" />
          </div>
          <CardTitle className="mb-1 text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ToolCard;
