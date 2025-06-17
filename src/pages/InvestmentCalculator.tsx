
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, PiggyBank } from 'lucide-react';

type InvestmentType = 'fd' | 'rd' | 'nsc';

interface CalculationResult {
  maturityAmount: number;
  totalInvestment: number;
  totalInterest: number;
  interestRate: number;
}

const InvestmentCalculator = () => {
  const [investmentType, setInvestmentType] = useState<InvestmentType>('fd');
  const [principal, setPrincipal] = useState<string>('');
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [termYears, setTermYears] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateFD = (p: number, r: number, t: number, compoundingFreq: number = 4): CalculationResult => {
    const maturityAmount = p * Math.pow(1 + r / (100 * compoundingFreq), compoundingFreq * t);
    return {
      maturityAmount,
      totalInvestment: p,
      totalInterest: maturityAmount - p,
      interestRate: r
    };
  };

  const calculateRD = (monthlyAmount: number, r: number, t: number): CalculationResult => {
    const months = t * 12;
    const monthlyRate = r / (100 * 12);
    const maturityAmount = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyAmount * months;
    
    return {
      maturityAmount,
      totalInvestment,
      totalInterest: maturityAmount - totalInvestment,
      interestRate: r
    };
  };

  const calculateNSC = (p: number, t: number): CalculationResult => {
    const rate = 6.8; // Current NSC rate (as of 2024)
    const maturityAmount = p * Math.pow(1 + rate / 100, t);
    return {
      maturityAmount,
      totalInvestment: p,
      totalInterest: maturityAmount - p,
      interestRate: rate
    };
  };

  const handleCalculate = () => {
    let result: CalculationResult;
    const years = parseFloat(termYears);

    switch (investmentType) {
      case 'fd':
        const fdPrincipal = parseFloat(principal);
        const fdRate = parseFloat(interestRate);
        result = calculateFD(fdPrincipal, fdRate, years);
        break;
      case 'rd':
        const rdAmount = parseFloat(monthlyAmount);
        const rdRate = parseFloat(interestRate);
        result = calculateRD(rdAmount, rdRate, years);
        break;
      case 'nsc':
        const nscPrincipal = parseFloat(principal);
        result = calculateNSC(nscPrincipal, years);
        break;
      default:
        return;
    }

    setResult(result);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Indian Investment Calculator</h1>
        <p className="text-muted-foreground">Calculate maturity values for FD, RD, and NSC investments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Investment Calculator
            </CardTitle>
            <CardDescription>Enter your investment details to calculate maturity value.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Investment Type</Label>
              <Select value={investmentType} onValueChange={(value) => setInvestmentType(value as InvestmentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fd">Fixed Deposit (FD)</SelectItem>
                  <SelectItem value="rd">Recurring Deposit (RD)</SelectItem>
                  <SelectItem value="nsc">National Savings Certificate (NSC)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {investmentType === 'fd' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="number"
                    placeholder="Enter principal amount"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="Enter interest rate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
              </>
            )}

            {investmentType === 'rd' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="monthlyAmount">Monthly Investment (₹)</Label>
                  <Input
                    id="monthlyAmount"
                    type="number"
                    placeholder="Enter monthly amount"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="Enter interest rate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
              </>
            )}

            {investmentType === 'nsc' && (
              <div className="space-y-2">
                <Label htmlFor="principal">Investment Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="Enter investment amount"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  NSC has a fixed tenure of 5 years and current interest rate of 6.8% p.a.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="termYears">
                {investmentType === 'nsc' ? 'Tenure (Fixed 5 years)' : 'Investment Period (Years)'}
              </Label>
              <Input
                id="termYears"
                type="number"
                placeholder={investmentType === 'nsc' ? '5' : 'Enter number of years'}
                value={investmentType === 'nsc' ? '5' : termYears}
                onChange={(e) => setTermYears(e.target.value)}
                disabled={investmentType === 'nsc'}
              />
            </div>

            <Button onClick={handleCalculate} className="w-full">
              <Calculator />
              Calculate Maturity Value
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                Investment Summary
              </CardTitle>
              <CardDescription>Your investment calculation results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Investment</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(result.totalInvestment)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-xl font-bold text-green-600">{result.interestRate}% p.a.</p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">Maturity Amount</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-200">{formatCurrency(result.maturityAmount)}</p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">Total Interest Earned</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{formatCurrency(result.totalInterest)}</p>
              </div>

              <div className="text-xs text-muted-foreground mt-4">
                <p>* Calculations are approximate and may vary based on bank policies.</p>
                <p>* For FD: Quarterly compounding assumed.</p>
                <p>* For RD: Monthly compounding assumed.</p>
                <p>* NSC interest rate is subject to government revisions.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InvestmentCalculator;
