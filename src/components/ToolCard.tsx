
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  animationDelay: string;
  color: 'primary' | 'green' | 'yellow' | 'purple' | 'accent';
}

const ToolCard = ({ icon: Icon, title, description, href, animationDelay, color = 'primary' }: ToolCardProps) => {
  let bgClass, textClass, hoverBgClass, borderClass;

  switch (color) {
    case 'green':
      bgClass = 'bg-green/10';
      textClass = 'text-green';
      hoverBgClass = 'group-hover:bg-green';
      borderClass = 'hover:border-green';
      break;
    case 'yellow':
      bgClass = 'bg-yellow/10';
      textClass = 'text-yellow';
      hoverBgClass = 'group-hover:bg-yellow';
      borderClass = 'hover:border-yellow';
      break;
    case 'purple':
      bgClass = 'bg-purple/10';
      textClass = 'text-purple';
      hoverBgClass = 'group-hover:bg-purple';
      borderClass = 'hover:border-purple';
      break;
    case 'accent':
      bgClass = 'bg-accent';
      textClass = 'text-accent-foreground';
      hoverBgClass = 'group-hover:bg-accent/90';
      borderClass = 'hover:border-accent-foreground';
      break;
    case 'primary':
    default:
      bgClass = 'bg-primary/10';
      textClass = 'text-primary';
      hoverBgClass = 'group-hover:bg-primary';
      borderClass = 'hover:border-primary';
  }

  return (
    <Link to={href} className="block group animate-fade-in" style={{ animationDelay }}>
      <Card className={cn("h-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg", borderClass)}>
        <CardHeader className="flex flex-col items-center text-center p-6">
          <div className={cn("p-3 rounded-full mb-4 transition-colors duration-300", bgClass, hoverBgClass)}>
            <Icon className={cn("h-8 w-8 transition-colors duration-300", textClass)} />
          </div>
          <CardTitle className="mb-1 text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ToolCard;
