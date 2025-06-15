
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LoanCalculator = () => {
  return (
    <div className="animate-fade-in text-center">
      <h1 className="text-3xl font-bold mb-2">Loan Calculator</h1>
      <p className="text-muted-foreground mb-8">This tool is coming soon!</p>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>We're building a powerful loan calculator to help you with your financial planning. Check back soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanCalculator;
