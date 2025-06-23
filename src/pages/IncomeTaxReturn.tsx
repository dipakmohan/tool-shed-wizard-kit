import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileText, User, Building, Calculator, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ITRFormData {
  // Personal Information
  firstName: string;
  middleName?: string;
  lastName: string;
  pan: string;
  aadhaar: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  mobile: string;
  email: string;
  
  // Address
  flatNo: string;
  premises: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  
  // Income Details
  salary: number;
  allowances: number;
  houseProperty: number;
  businessIncome: number;
  capitalGains: number;
  otherSources: number;
  
  // Deductions
  section80C: number;
  section80D: number;
  section80G: number;
  section80E: number;
  section80EE: number;
  section80TTA: number;
  
  // Tax Details
  tdsOnSalary: number;
  tdsOther: number;
  advanceTax: number;
  selfAssessmentTax: number;
  
  // Bank Details
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

const IncomeTaxReturn = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ITRFormData>({
    defaultValues: {
      salary: 0,
      allowances: 0,
      houseProperty: 0,
      businessIncome: 0,
      capitalGains: 0,
      otherSources: 0,
      section80C: 0,
      section80D: 0,
      section80G: 0,
      section80E: 0,
      section80EE: 0,
      section80TTA: 0,
      tdsOnSalary: 0,
      tdsOther: 0,
      advanceTax: 0,
      selfAssessmentTax: 0,
    }
  });

  const watchedValues = form.watch();

  const calculateTotalIncome = () => {
    return (watchedValues.salary || 0) + 
           (watchedValues.allowances || 0) + 
           (watchedValues.houseProperty || 0) + 
           (watchedValues.businessIncome || 0) + 
           (watchedValues.capitalGains || 0) + 
           (watchedValues.otherSources || 0);
  };

  const calculateTotalDeductions = () => {
    return Math.min((watchedValues.section80C || 0), 150000) +
           Math.min((watchedValues.section80D || 0), 25000) +
           (watchedValues.section80G || 0) +
           (watchedValues.section80E || 0) +
           (watchedValues.section80EE || 0) +
           Math.min((watchedValues.section80TTA || 0), 10000);
  };

  const calculateTaxableIncome = () => {
    const totalIncome = calculateTotalIncome();
    const totalDeductions = calculateTotalDeductions();
    const standardDeduction = 75000; // Updated for new tax regime FY 2024-25
    return Math.max(0, totalIncome - totalDeductions - standardDeduction);
  };

  const calculateTax = () => {
    const taxableIncome = calculateTaxableIncome();
    let tax = 0;

    // Updated New Tax Regime Slabs for FY 2024-25
    if (taxableIncome > 300000) {
      if (taxableIncome <= 700000) {
        tax += (Math.min(taxableIncome, 700000) - 300000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax += 400000 * 0.05;
        tax += (Math.min(taxableIncome, 1000000) - 700000) * 0.10;
      } else if (taxableIncome <= 1200000) {
        tax += 400000 * 0.05;
        tax += 300000 * 0.10;
        tax += (Math.min(taxableIncome, 1200000) - 1000000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        tax += 400000 * 0.05;
        tax += 300000 * 0.10;
        tax += 200000 * 0.15;
        tax += (Math.min(taxableIncome, 1500000) - 1200000) * 0.20;
      } else {
        tax += 400000 * 0.05;
        tax += 300000 * 0.10;
        tax += 200000 * 0.15;
        tax += 300000 * 0.20;
        tax += (taxableIncome - 1500000) * 0.30;
      }
    }

    // Add Health & Education Cess (4%)
    tax += tax * 0.04;

    // Apply rebate u/s 87A for income up to 7 lakhs
    if (calculateTotalIncome() <= 700000) {
      tax = Math.max(0, tax - 25000);
    }

    return Math.round(tax);
  };

  const calculateTotalTaxPaid = () => {
    return (watchedValues.tdsOnSalary || 0) + 
           (watchedValues.tdsOther || 0) + 
           (watchedValues.advanceTax || 0) + 
           (watchedValues.selfAssessmentTax || 0);
  };

  const calculateRefundOrDue = () => {
    const taxLiability = calculateTax();
    const taxPaid = calculateTotalTaxPaid();
    return taxPaid - taxLiability;
  };

  const onSubmit = (data: ITRFormData) => {
    console.log('ITR Form Data:', data);
    setIsSubmitted(true);
    toast.success('Income Tax Return form has been prepared successfully!');
  };

  const downloadITR = () => {
    const data = form.getValues();
    const itrData = {
      ...data,
      totalIncome: calculateTotalIncome(),
      totalDeductions: calculateTotalDeductions(),
      taxableIncome: calculateTaxableIncome(),
      taxLiability: calculateTax(),
      refundOrDue: calculateRefundOrDue(),
      financialYear: '2024-25',
      assessmentYear: '2025-26'
    };
    
    const blob = new Blob([JSON.stringify(itrData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ITR_${data.pan}_FY2024-25.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('ITR data downloaded successfully!');
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">
              ITR Form Prepared Successfully!
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Your Income Tax Return for FY 2024-25 (AY 2025-26) has been prepared
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-xl font-bold">₹{calculateTotalIncome().toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <p className="text-sm text-muted-foreground">Tax Liability</p>
                <p className="text-xl font-bold">₹{calculateTax().toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  {calculateRefundOrDue() >= 0 ? 'Refund Due' : 'Tax Payable'}
                </p>
                <p className={`text-xl font-bold ${calculateRefundOrDue() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(calculateRefundOrDue()).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={downloadITR} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download ITR Data
              </Button>
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Edit Form
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Next Steps:</p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                <li>• Visit the Income Tax e-filing portal (incometax.gov.in)</li>
                <li>• Upload your ITR form using the downloaded data</li>
                <li>• Verify your return using Aadhaar OTP, Net Banking, or Bank Account</li>
                <li>• Keep all supporting documents ready for verification</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Income Tax Return Filing</h1>
        <p className="text-muted-foreground">
          File your ITR for Financial Year 2024-25 (Assessment Year 2025-26)
        </p>
        <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
          Using Saral-1 Form | New Tax Regime | Standard Deduction: ₹75,000
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={`step-${currentStep}`} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="step-1" className="text-xs">Personal Info</TabsTrigger>
                <TabsTrigger value="step-2" className="text-xs">Income</TabsTrigger>
                <TabsTrigger value="step-3" className="text-xs">Deductions</TabsTrigger>
                <TabsTrigger value="step-4" className="text-xs">Tax & TDS</TabsTrigger>
                <TabsTrigger value="step-5" className="text-xs">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="step-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="First Name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="middleName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Middle Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Middle Name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Last Name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PAN Number *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="ABCDE1234F" maxLength={10} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="aadhaar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Aadhaar Number *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="1234 5678 9012" maxLength={12} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="individual">Individual</SelectItem>
                                  <SelectItem value="resident">Resident Individual</SelectItem>
                                  <SelectItem value="nri">Non-Resident Individual</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="mobile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="9876543210" maxLength={10} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="email@example.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Address Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="flatNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Flat/Door/Block No. *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Flat No. 123" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="premises"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name of Premises/Building/Village *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Building/Society Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Road/Street/Lane/Post Office *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Area/Locality" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="City" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="State" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PIN Code *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="123456" maxLength={6} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="step-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Income Details (FY 2024-25)
                    </CardTitle>
                    <CardDescription>
                      Enter all your income sources for the financial year 2024-25
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary Income (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="allowances"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Allowances & Perquisites (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="houseProperty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Income from House Property (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="businessIncome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business/Professional Income (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="capitalGains"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capital Gains (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="otherSources"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Income from Other Sources (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Gross Income:</span>
                        <span className="text-xl font-bold text-blue-600">
                          ₹{calculateTotalIncome().toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="step-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Deductions & Exemptions</CardTitle>
                    <CardDescription>
                      Enter your eligible deductions under various sections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="section80C"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section 80C (Max ₹1,50,000)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                EPF, PPF, ELSS, Life Insurance, etc.
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="section80D"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section 80D (Max ₹25,000)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Health Insurance Premium
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="section80G"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section 80G</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Donations to Charitable Organizations
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="section80E"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section 80E</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Interest on Education Loan
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="section80EE"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section 80EE</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Interest on Home Loan (First Time)
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="section80TTA"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section 80TTA (Max ₹10,000)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="0"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                Interest on Savings Account
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <span>Standard Deduction (Auto Applied):</span>
                          <span className="font-semibold text-green-600">₹75,000</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Deductions:</span>
                          <span className="text-xl font-bold text-blue-600">
                            ₹{(calculateTotalDeductions() + 75000).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="step-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Payments & TDS</CardTitle>
                      <CardDescription>
                        Enter tax payments made during FY 2024-25
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="tdsOnSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TDS on Salary (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tdsOther"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TDS on Other Income (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="advanceTax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Advance Tax Paid (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="selfAssessmentTax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Self Assessment Tax (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Bank Details (For Refund)</CardTitle>
                      <CardDescription>
                        Enter your bank account details for refund processing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Bank Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Account Number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="IFSC Code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Important:</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          Ensure bank account is linked with your PAN and Aadhaar for smooth refund processing.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="step-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      ITR Summary - FY 2024-25 (AY 2025-26)
                    </CardTitle>
                    <CardDescription>
                      Review your income tax calculation before submission
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Gross Income</p>
                        <p className="text-xl font-bold">₹{calculateTotalIncome().toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Total Deductions</p>
                        <p className="text-xl font-bold">₹{(calculateTotalDeductions() + 75000).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Taxable Income</p>
                        <p className="text-xl font-bold">₹{calculateTaxableIncome().toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Tax Liability</p>
                        <p className="text-xl font-bold">₹{calculateTax().toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Total Tax Paid</p>
                        <p className="text-xl font-bold">₹{calculateTotalTaxPaid().toLocaleString('en-IN')}</p>
                      </div>
                      <div className={`p-4 rounded-lg border ${calculateRefundOrDue() >= 0 ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                        <p className="text-sm text-muted-foreground">
                          {calculateRefundOrDue() >= 0 ? 'Refund Due' : 'Tax Payable'}
                        </p>
                        <p className={`text-xl font-bold ${calculateRefundOrDue() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{Math.abs(calculateRefundOrDue()).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Tax Calculation Breakdown:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-muted rounded">
                          <span>Income up to ₹3,00,000 (0%)</span>
                          <span>₹0</span>
                        </div>
                        {calculateTaxableIncome() > 300000 && (
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span>₹3,00,001 to ₹7,00,000 (5%)</span>
                            <span>₹{Math.min((calculateTaxableIncome() - 300000) * 0.05, 400000 * 0.05).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {calculateTaxableIncome() > 700000 && (
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span>₹7,00,001 to ₹10,00,000 (10%)</span>
                            <span>₹{Math.min((calculateTaxableIncome() - 700000) * 0.10, 300000 * 0.10).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {calculateTaxableIncome() > 1000000 && (
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span>₹10,00,001 to ₹12,00,000 (15%)</span>
                            <span>₹{Math.min((calculateTaxableIncome() - 1000000) * 0.15, 200000 * 0.15).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {calculateTaxableIncome() > 1200000 && (
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span>₹12,00,001 to ₹15,00,000 (20%)</span>
                            <span>₹{Math.min((calculateTaxableIncome() - 1200000) * 0.20, 300000 * 0.20).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {calculateTaxableIncome() > 1500000 && (
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span>₹15,00,001 and above (30%)</span>
                            <span>₹{((calculateTaxableIncome() - 1500000) * 0.30).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between p-2 bg-muted rounded">
                          <span>Health & Education Cess (4%)</span>
                          <span>₹{Math.round(calculateTax() * 0.04 / 1.04).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Prepare ITR Form
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                disabled={currentStep === 5}
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default IncomeTaxReturn;
