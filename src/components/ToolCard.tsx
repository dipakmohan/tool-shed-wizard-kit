
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
  color: 'primary' | 'green' | 'yellow' | 'purple' | 'accent' | 'gradient';
}

const ToolCard = ({ icon: Icon, title, description, href, animationDelay, color = 'primary' }: ToolCardProps) => {
  let bgClass, textClass, hoverBgClass, borderClass, iconBgClass;

  switch (color) {
    case 'gradient':
      bgClass = 'bg-gradient-to-br from-blue-50 via-green-50 to-purple-50';
      textClass = 'text-primary';
      hoverBgClass = 'group-hover:from-blue-100 group-hover:via-green-100 group-hover:to-purple-100';
      borderClass = 'hover:border-transparent hover:shadow-xl hover:shadow-blue-500/20';
      iconBgClass = 'bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 text-white';
      break;
    case 'green':
      bgClass = 'bg-green/10';
      textClass = 'text-green';
      hoverBgClass = 'group-hover:bg-green/20';
      borderClass = 'hover:border-green hover:shadow-lg hover:shadow-green/20';
      iconBgClass = 'bg-green text-green-foreground';
      break;
    case 'yellow':
      bgClass = 'bg-yellow/10';
      textClass = 'text-yellow';
      hoverBgClass = 'group-hover:bg-yellow/20';
      borderClass = 'hover:border-yellow hover:shadow-lg hover:shadow-yellow/20';
      iconBgClass = 'bg-yellow text-yellow-foreground';
      break;
    case 'purple':
      bgClass = 'bg-purple/10';
      textClass = 'text-purple';
      hoverBgClass = 'group-hover:bg-purple/20';
      borderClass = 'hover:border-purple hover:shadow-lg hover:shadow-purple/20';
      iconBgClass = 'bg-purple text-purple-foreground';
      break;
    case 'accent':
      bgClass = 'bg-accent/50';
      textClass = 'text-accent-foreground';
      hoverBgClass = 'group-hover:bg-accent/70';
      borderClass = 'hover:border-accent-foreground hover:shadow-lg hover:shadow-accent/20';
      iconBgClass = 'bg-accent text-accent-foreground';
      break;
    case 'primary':
    default:
      bgClass = 'bg-primary/10';
      textClass = 'text-primary';
      hoverBgClass = 'group-hover:bg-primary/20';
      borderClass = 'hover:border-primary hover:shadow-lg hover:shadow-primary/20';
      iconBgClass = 'bg-primary text-primary-foreground';
  }

  return (
    <Link to={href} className="block group animate-fade-in" style={{ animationDelay }}>
      <Card className={cn(
        "h-full transition-all duration-300 transform hover:-translate-y-2 border-2", 
        bgClass, 
        hoverBgClass, 
        borderClass
      )}>
        <CardHeader className="flex flex-col items-center text-center p-6">
          <div className={cn(
            "p-4 rounded-2xl mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 shadow-lg", 
            iconBgClass
          )}>
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className={cn("mb-2 text-lg font-bold", textClass)}>
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ToolCard;
