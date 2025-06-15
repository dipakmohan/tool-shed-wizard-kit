
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from 'lucide-react';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('5');
  const [results, setResults] = useState<{ monthlyPayment: number; totalInterest: number; totalPayment: number } | null>(null);

  const calculateLoan = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const termYears = parseFloat(loanTerm);

    if (isNaN(P) || isNaN(annualRate) || isNaN(termYears) || P <= 0 || annualRate <= 0 || termYears <= 0) {
      // Basic validation
      setResults(null);
      return;
    }

    const i = annualRate / 100 / 12; // monthly interest rate
    const n = termYears * 12; // number of months

    const M = (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const totalPayment = M * n;
    const totalInterest = totalPayment - P;

    setResults({
      monthlyPayment: M,
      totalInterest,
      totalPayment,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Loan Calculator</h1>
        <p className="text-muted-foreground">Estimate your loan payments.</p>
      </div>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Enter Loan Details</CardTitle>
          <CardDescription>Fill in the fields below to calculate your monthly payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount ($)</Label>
            <Input id="amount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="e.g., 10000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest">Annual Interest Rate (%)</Label>
            <Input id="interest" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="e.g., 5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Loan Term (Years)</Label>
            <Input id="term" type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="e.g., 5" />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 items-stretch">
          <Button onClick={calculateLoan} className="w-full">
            <DollarSign /> Calculate
          </Button>
          {results && (
            <div className="w-full text-center space-y-2 pt-4 border-t">
              <h3 className="text-lg font-semibold">Results</h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment:</span>
                <span className="font-medium">${results.monthlyPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest:</span>
                <span className="font-medium">${results.totalInterest.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Payment:</span>
                <span className="font-medium">${results.totalPayment.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoanCalculator;
