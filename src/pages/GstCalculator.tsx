
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, Receipt, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GstCalculator = () => {
  const [amount, setAmount] = useState<string>('');
  const [gstRate, setGstRate] = useState<string>('18');
  const [calculationType, setCalculationType] = useState<string>('exclusive');
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const gstSlabs = [
    { value: '0', label: '0% - Essential goods' },
    { value: '5', label: '5% - Household necessities' },
    { value: '12', label: '12% - Standard items' },
    { value: '18', label: '18% - Most goods & services' },
    { value: '28', label: '28% - Luxury items' },
  ];

  const calculateGST = () => {
    const baseAmount = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (!baseAmount || baseAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    let gstAmount, totalAmount, netAmount;

    if (calculationType === 'exclusive') {
      // GST calculation on amount (excluding GST)
      gstAmount = (baseAmount * rate) / 100;
      totalAmount = baseAmount + gstAmount;
      netAmount = baseAmount;
    } else {
      // GST calculation on amount (including GST)
      netAmount = (baseAmount * 100) / (100 + rate);
      gstAmount = baseAmount - netAmount;
      totalAmount = baseAmount;
    }

    setResults({
      netAmount: netAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      rate: rate,
      type: calculationType
    });

    toast({
      title: "GST Calculated Successfully",
      description: `GST amount: ₹${gstAmount.toFixed(2)}`,
    });
  };

  const clearCalculation = () => {
    setAmount('');
    setResults(null);
    toast({
      title: "Calculation Cleared",
      description: "All fields have been reset",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Receipt className="h-8 w-8 text-primary" />
          GST Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate GST (Goods and Services Tax) for your invoices with different tax slabs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              GST Calculation
            </CardTitle>
            <CardDescription>
              Enter the amount and select GST rate to calculate tax
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst-rate">GST Rate</Label>
              <Select value={gstRate} onValueChange={setGstRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select GST rate" />
                </SelectTrigger>
                <SelectContent>
                  {gstSlabs.map((slab) => (
                    <SelectItem key={slab.value} value={slab.value}>
                      {slab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-type">Calculation Type</Label>
              <Select value={calculationType} onValueChange={setCalculationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select calculation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exclusive">Amount excluding GST</SelectItem>
                  <SelectItem value="inclusive">Amount including GST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateGST} className="flex-1">
                Calculate GST
              </Button>
              <Button variant="outline" onClick={clearCalculation}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">GST Calculation Results</CardTitle>
              <CardDescription>
                {results.type === 'exclusive' ? 'Amount excluding GST' : 'Amount including GST'} at {results.rate}% GST
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Net Amount</div>
                  <div className="text-2xl font-bold text-blue-600">₹{results.netAmount}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">GST Amount ({results.rate}%)</div>
                  <div className="text-2xl font-bold text-orange-600">₹{results.gstAmount}</div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-3xl font-bold text-green-600">₹{results.totalAmount}</div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Breakdown:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹{results.netAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({results.rate}%):</span>
                    <span>₹{results.gstAmount}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>₹{results.totalAmount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GST Rate Information</CardTitle>
          <CardDescription>Understanding different GST slabs in India</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {gstSlabs.map((slab) => (
              <div key={slab.value} className="p-3 border rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{slab.value}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {slab.label.split(' - ')[1]}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GstCalculator;
