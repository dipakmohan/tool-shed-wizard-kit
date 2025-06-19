
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Receipt } from 'lucide-react';

interface TaxCalculation {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  netIncome: number;
  regime: string;
  financialYear: string;
}

interface TaxSlab {
  min: number;
  max: number;
  rate: number;
}

const TaxCalculator = () => {
  const [income, setIncome] = useState<string>('');
  const [deductions, setDeductions] = useState<string>('');
  const [age, setAge] = useState<string>('below60');
  const [regime, setRegime] = useState<string>('new');
  const [financialYear, setFinancialYear] = useState<string>('2023-24');
  const [result, setResult] = useState<TaxCalculation | null>(null);

  const getOldRegimeTaxSlabs = (fy: string, ageCategory: string) => {
    const slabs: { [key: string]: { exemption: { [age: string]: number }, slabs: TaxSlab[] } } = {
      '2023-24': {
        exemption: { below60: 250000, '60to80': 300000, 'above80': 500000 },
        slabs: [
          { min: 0, max: 250000, rate: 0.05 },
          { min: 250000, max: 500000, rate: 0.20 },
          { min: 500000, max: 1000000, rate: 0.30 },
          { min: 1000000, max: Infinity, rate: 0.30 }
        ]
      },
      '2024-25': {
        exemption: { below60: 300000, '60to80': 350000, 'above80': 500000 },
        slabs: [
          { min: 0, max: 300000, rate: 0.05 },
          { min: 300000, max: 600000, rate: 0.20 },
          { min: 600000, max: 1200000, rate: 0.30 },
          { min: 1200000, max: Infinity, rate: 0.30 }
        ]
      }
    };
    return slabs[fy] || slabs['2023-24'];
  };

  const getNewRegimeTaxSlabs = (fy: string) => {
    const slabs: { [key: string]: { exemption: number, slabs: TaxSlab[] } } = {
      '2023-24': {
        exemption: 300000,
        slabs: [
          { min: 300000, max: 600000, rate: 0.05 },
          { min: 600000, max: 900000, rate: 0.10 },
          { min: 900000, max: 1200000, rate: 0.15 },
          { min: 1200000, max: 1500000, rate: 0.20 },
          { min: 1500000, max: Infinity, rate: 0.30 }
        ]
      },
      '2024-25': {
        exemption: 300000,
        slabs: [
          { min: 300000, max: 700000, rate: 0.05 },
          { min: 700000, max: 1000000, rate: 0.10 },
          { min: 1000000, max: 1200000, rate: 0.15 },
          { min: 1200000, max: 1500000, rate: 0.20 },
          { min: 1500000, max: Infinity, rate: 0.30 }
        ]
      }
    };
    return slabs[fy] || slabs['2023-24'];
  };

  const calculateOldRegimeTax = (taxableIncome: number, ageCategory: string, fy: string): number => {
    const config = getOldRegimeTaxSlabs(fy, ageCategory);
    const exemptionLimit = config.exemption[ageCategory];
    
    if (taxableIncome <= exemptionLimit) return 0;

    let tax = 0;
    let remainingIncome = taxableIncome - exemptionLimit;

    for (const slab of config.slabs) {
      if (remainingIncome <= 0) break;
      const taxableInSlab = Math.min(remainingIncome, slab.max - slab.min);
      tax += taxableInSlab * slab.rate;
      remainingIncome -= taxableInSlab;
    }

    return tax;
  };

  const calculateNewRegimeTax = (taxableIncome: number, fy: string): number => {
    const config = getNewRegimeTaxSlabs(fy);
    
    if (taxableIncome <= config.exemption) return 0;

    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const slab of config.slabs) {
      if (remainingIncome <= slab.min) break;
      const taxableInSlab = Math.min(remainingIncome - slab.min, slab.max - slab.min);
      if (taxableInSlab > 0) {
        tax += taxableInSlab * slab.rate;
      }
    }

    return tax;
  };

  const calculateTax = () => {
    const totalIncome = parseFloat(income);
    const totalDeductions = regime === 'old' ? parseFloat(deductions) : 0;
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    let incomeTax: number;
    if (regime === 'old') {
      incomeTax = calculateOldRegimeTax(taxableIncome, age, financialYear);
    } else {
      incomeTax = calculateNewRegimeTax(taxableIncome, financialYear);
    }

    const cess = incomeTax * 0.04;
    const totalTax = incomeTax + cess;
    const netIncome = totalIncome - totalTax;

    setResult({
      totalIncome,
      totalDeductions,
      taxableIncome,
      incomeTax,
      cess,
      totalTax,
      netIncome,
      regime: regime === 'old' ? 'Old Regime' : 'New Regime',
      financialYear
    });
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
        <h1 className="text-3xl font-bold">Indian Income Tax Calculator</h1>
        <p className="text-muted-foreground">Calculate your income tax with updated tax slabs for different financial years.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Tax Calculator
            </CardTitle>
            <CardDescription>Enter your income details to calculate tax liability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Financial Year</Label>
                <Select value={financialYear} onValueChange={setFinancialYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-24">FY 2023-24 (AY 2024-25)</SelectItem>
                    <SelectItem value="2024-25">FY 2024-25 (AY 2025-26)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tax Regime</Label>
                <Select value={regime} onValueChange={setRegime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Tax Regime</SelectItem>
                    <SelectItem value="old">Old Tax Regime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">Annual Income (₹)</Label>
              <Input
                id="income"
                type="number"
                placeholder="Enter your annual income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            {regime === 'old' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="deductions">Total Deductions (₹)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    placeholder="80C, 80D, HRA, etc."
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include 80C (₹1.5L), 80D, HRA, LTA, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Age Category</Label>
                  <Select value={age} onValueChange={setAge}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below60">Below 60 years</SelectItem>
                      <SelectItem value="60to80">60-80 years (Senior Citizen)</SelectItem>
                      <SelectItem value="above80">Above 80 years (Super Senior)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {regime === 'new' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">New Regime Benefits:</p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                  <li>• Standard deduction: ₹50,000</li>
                  <li>• No major deductions like 80C, 80D allowed</li>
                  <li>• Lower tax rates</li>
                  <li>• Rebate u/s 87A: ₹25,000 for income up to ₹7L</li>
                </ul>
              </div>
            )}

            <Button onClick={calculateTax} className="w-full" disabled={!income}>
              <Calculator />
              Calculate Tax
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Tax Calculation ({result.regime} - FY {result.financialYear})
              </CardTitle>
              <CardDescription>Your detailed tax breakdown.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Gross Income</p>
                      <p className="text-xl font-bold">{formatCurrency(result.totalIncome)}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Taxable Income</p>
                      <p className="text-xl font-bold">{formatCurrency(result.taxableIncome)}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">Total Tax</p>
                    <p className="text-3xl font-bold text-red-800 dark:text-red-200">{formatCurrency(result.totalTax)}</p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">Net Income (After Tax)</p>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200">{formatCurrency(result.netIncome)}</p>
                  </div>
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span>Gross Income</span>
                      <span className="font-medium">{formatCurrency(result.totalIncome)}</span>
                    </div>
                    
                    {result.totalDeductions > 0 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded">
                        <span>Less: Deductions</span>
                        <span className="font-medium text-green-600">-{formatCurrency(result.totalDeductions)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded">
                      <span>Taxable Income</span>
                      <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded">
                      <span>Income Tax</span>
                      <span className="font-medium text-orange-600">{formatCurrency(result.incomeTax)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded">
                      <span>Health & Education Cess (4%)</span>
                      <span className="font-medium text-orange-600">{formatCurrency(result.cess)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded border-2 border-red-200 dark:border-red-800">
                      <span className="font-bold">Total Tax Liability</span>
                      <span className="font-bold text-red-600">{formatCurrency(result.totalTax)}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="text-xs text-muted-foreground mt-4 space-y-1">
                <p>* Calculations are based on {result.financialYear} tax slabs and may vary.</p>
                <p>* Consult a tax advisor for accurate tax planning.</p>
                <p>* Surcharge applicable for income above ₹50L/₹1Cr not included.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaxCalculator;
