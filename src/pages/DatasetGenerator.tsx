import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Database, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DatasetConfig {
  rows: number;
  dataTypes: string[];
  country: string;
  includeHeaders: boolean;
}

const DatasetGenerator = () => {
  const [config, setConfig] = useState<DatasetConfig>({
    rows: 100,
    dataTypes: ['name'],
    country: 'US',
    includeHeaders: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const { toast } = useToast();

  const dataTypeOptions = [
    // Personal Data
    { value: 'name', label: 'Full Name', category: 'Personal' },
    { value: 'firstName', label: 'First Name', category: 'Personal' },
    { value: 'lastName', label: 'Last Name', category: 'Personal' },
    { value: 'email', label: 'Email', category: 'Personal' },
    { value: 'phone', label: 'Phone Number', category: 'Personal' },
    { value: 'address', label: 'Address', category: 'Personal' },
    { value: 'city', label: 'City', category: 'Personal' },
    { value: 'age', label: 'Age', category: 'Personal' },
    
    // Commercial Data
    { value: 'productName', label: 'Product Name', category: 'Commercial' },
    { value: 'productPrice', label: 'Product Price', category: 'Commercial' },
    { value: 'productCategory', label: 'Product Category', category: 'Commercial' },
    { value: 'brandName', label: 'Brand Name', category: 'Commercial' },
    { value: 'sku', label: 'SKU Code', category: 'Commercial' },
    { value: 'discount', label: 'Discount %', category: 'Commercial' },
    
    // Sales Data
    { value: 'salesAmount', label: 'Sales Amount', category: 'Sales' },
    { value: 'salesRep', label: 'Sales Representative', category: 'Sales' },
    { value: 'customerType', label: 'Customer Type', category: 'Sales' },
    { value: 'region', label: 'Sales Region', category: 'Sales' },
    { value: 'quarterlyTarget', label: 'Quarterly Target', category: 'Sales' },
    { value: 'leadSource', label: 'Lead Source', category: 'Sales' },
    
    // Manufacturing Data
    { value: 'batchNumber', label: 'Batch Number', category: 'Manufacturing' },
    { value: 'productionQuantity', label: 'Production Quantity', category: 'Manufacturing' },
    { value: 'qualityScore', label: 'Quality Score', category: 'Manufacturing' },
    { value: 'machineName', label: 'Machine Name', category: 'Manufacturing' },
    { value: 'shiftTime', label: 'Shift Time', category: 'Manufacturing' },
    { value: 'defectRate', label: 'Defect Rate %', category: 'Manufacturing' },
    
    // Weather Data
    { value: 'temperature', label: 'Temperature (°C)', category: 'Weather' },
    { value: 'humidity', label: 'Humidity %', category: 'Weather' },
    { value: 'windSpeed', label: 'Wind Speed (km/h)', category: 'Weather' },
    { value: 'precipitation', label: 'Precipitation (mm)', category: 'Weather' },
    { value: 'weatherCondition', label: 'Weather Condition', category: 'Weather' },
    { value: 'uvIndex', label: 'UV Index', category: 'Weather' },
    
    // Population Data
    { value: 'populationSize', label: 'Population Size', category: 'Population' },
    { value: 'ageGroup', label: 'Age Group', category: 'Population' },
    { value: 'educationLevel', label: 'Education Level', category: 'Population' },
    { value: 'incomeLevel', label: 'Income Level', category: 'Population' },
    { value: 'employmentStatus', label: 'Employment Status', category: 'Population' },
    { value: 'housingType', label: 'Housing Type', category: 'Population' },
    
    // General Data
    { value: 'company', label: 'Company', category: 'General' },
    { value: 'jobTitle', label: 'Job Title', category: 'General' },
    { value: 'salary', label: 'Salary', category: 'General' },
    { value: 'date', label: 'Date', category: 'General' },
    { value: 'boolean', label: 'Boolean', category: 'General' },
    { value: 'number', label: 'Random Number', category: 'General' },
    { value: 'text', label: 'Lorem Text', category: 'General' }
  ];

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' }
  ];

  const generateMockData = (type: string, country: string) => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'William', 'Ashley'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const cities = {
      US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
      UK: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
      CA: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
      IN: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']
    };
    const companies = ['TechCorp', 'InnovateLabs', 'GlobalSoft', 'DataFlow', 'CloudTech', 'SmartSolutions'];
    const jobTitles = ['Software Engineer', 'Data Analyst', 'Product Manager', 'Designer', 'Marketing Specialist'];
    const products = ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Camera', 'Watch'];
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'];
    const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Microsoft'];
    const machines = ['CNC-001', 'Assembly-Line-A', 'Quality-Check-B', 'Packaging-Unit-C'];
    const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Foggy', 'Windy'];

    switch (type) {
      case 'name':
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      case 'firstName':
        return firstNames[Math.floor(Math.random() * firstNames.length)];
      case 'lastName':
        return lastNames[Math.floor(Math.random() * lastNames.length)];
      case 'email':
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
        return `${firstName}.${lastName}@example.com`;
      case 'phone':
        return `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
      case 'address':
        return `${Math.floor(Math.random() * 9999 + 1)} ${['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave'][Math.floor(Math.random() * 5)]}`;
      case 'city':
        return cities[country as keyof typeof cities]?.[Math.floor(Math.random() * cities[country as keyof typeof cities].length)] || cities.US[Math.floor(Math.random() * cities.US.length)];
      case 'age':
        return Math.floor(Math.random() * 50 + 18);
      case 'productName':
        return products[Math.floor(Math.random() * products.length)];
      case 'productPrice':
        return (Math.random() * 1000 + 10).toFixed(2);
      case 'productCategory':
        return categories[Math.floor(Math.random() * categories.length)];
      case 'brandName':
        return brands[Math.floor(Math.random() * brands.length)];
      case 'sku':
        return `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      case 'discount':
        return Math.floor(Math.random() * 50);
      case 'salesAmount':
        return Math.floor(Math.random() * 50000 + 1000);
      case 'salesRep':
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      case 'customerType':
        return ['Individual', 'Business', 'Enterprise'][Math.floor(Math.random() * 3)];
      case 'region':
        return ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)];
      case 'quarterlyTarget':
        return Math.floor(Math.random() * 200000 + 50000);
      case 'leadSource':
        return ['Website', 'Referral', 'Social Media', 'Email', 'Advertisement'][Math.floor(Math.random() * 5)];
      case 'batchNumber':
        return `BATCH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      case 'productionQuantity':
        return Math.floor(Math.random() * 1000 + 100);
      case 'qualityScore':
        return (Math.random() * 40 + 60).toFixed(1);
      case 'machineName':
        return machines[Math.floor(Math.random() * machines.length)];
      case 'shiftTime':
        return ['Day Shift', 'Night Shift', 'Evening Shift'][Math.floor(Math.random() * 3)];
      case 'defectRate':
        return (Math.random() * 5).toFixed(2);
      case 'temperature':
        return Math.floor(Math.random() * 40 - 10);
      case 'humidity':
        return Math.floor(Math.random() * 100);
      case 'windSpeed':
        return Math.floor(Math.random() * 50);
      case 'precipitation':
        return (Math.random() * 20).toFixed(1);
      case 'weatherCondition':
        return weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      case 'uvIndex':
        return Math.floor(Math.random() * 11);
      case 'populationSize':
        return Math.floor(Math.random() * 1000000 + 10000);
      case 'ageGroup':
        return ['0-18', '19-35', '36-50', '51-65', '65+'][Math.floor(Math.random() * 5)];
      case 'educationLevel':
        return ['High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'][Math.floor(Math.random() * 5)];
      case 'incomeLevel':
        return ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)];
      case 'employmentStatus':
        return ['Employed', 'Unemployed', 'Student', 'Retired'][Math.floor(Math.random() * 4)];
      case 'housingType':
        return ['Apartment', 'House', 'Condo', 'Other'][Math.floor(Math.random() * 4)];
      case 'company':
        return companies[Math.floor(Math.random() * companies.length)];
      case 'jobTitle':
        return jobTitles[Math.floor(Math.random() * jobTitles.length)];
      case 'salary':
        return Math.floor(Math.random() * 100000 + 30000);
      case 'date':
        const start = new Date(2020, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
      case 'boolean':
        return Math.random() > 0.5;
      case 'number':
        return Math.floor(Math.random() * 1000);
      case 'text':
        const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do'];
        return loremWords.slice(0, Math.floor(Math.random() * 5 + 3)).join(' ');
      default:
        return 'N/A';
    }
  };

  const handleGenerate = () => {
    if (config.dataTypes.length === 0) {
      toast({
        title: "No Data Types Selected",
        description: "Please select at least one data type.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const data = [];
      
      for (let i = 0; i < config.rows; i++) {
        const row: any = {};
        config.dataTypes.forEach(type => {
          const label = dataTypeOptions.find(opt => opt.value === type)?.label || type;
          row[label] = generateMockData(type, config.country);
        });
        data.push(row);
      }
      
      setGeneratedData(data);
      setIsGenerating(false);
      toast({
        title: "Dataset Generated!",
        description: `Successfully generated ${config.rows} rows of data.`
      });
    }, 1000);
  };

  const downloadCSV = () => {
    if (generatedData.length === 0) return;
    
    const headers = Object.keys(generatedData[0]);
    const csvContent = [
      headers.join(','),
      ...generatedData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_dataset.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    if (generatedData.length === 0) return;
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(generatedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Generated Data');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_dataset.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const groupedOptions = dataTypeOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof dataTypeOptions>);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Dataset Generator</h1>
        <p className="text-muted-foreground">Generate custom datasets with various data types and configurations.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Customize your dataset parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="rows">Number of Rows</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="10000"
                value={config.rows}
                onChange={(e) => setConfig(prev => ({ ...prev, rows: parseInt(e.target.value) || 100 }))}
              />
            </div>
            
            <div>
              <Label htmlFor="country">Country/Region</Label>
              <Select value={config.country} onValueChange={(value) => setConfig(prev => ({ ...prev, country: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Data Types</Label>
              <div className="max-h-64 overflow-y-auto mt-2 space-y-4">
                {Object.entries(groupedOptions).map(([category, options]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-sm mb-2 text-primary">{category}</h4>
                    <div className="grid grid-cols-1 gap-2 ml-4">
                      {options.map(option => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.dataTypes.includes(option.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setConfig(prev => ({ ...prev, dataTypes: [...prev.dataTypes, option.value] }));
                              } else {
                                setConfig(prev => ({ ...prev, dataTypes: prev.dataTypes.filter(t => t !== option.value) }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="animate-spin" /> : <Database />}
              {isGenerating ? 'Generating...' : 'Generate Dataset'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preview & Download</CardTitle>
            <CardDescription>
              {generatedData.length > 0 ? `${generatedData.length} rows generated` : 'No data generated yet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedData.length > 0 ? (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="download">Download</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="space-y-4">
                  <div className="max-h-64 overflow-auto border rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(generatedData[0]).map(header => (
                            <th key={header} className="p-2 text-left">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {generatedData.slice(0, 10).map((row, index) => (
                          <tr key={index} className="border-t">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="p-2">{value?.toString()}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {generatedData.length > 10 && (
                    <p className="text-xs text-muted-foreground">Showing first 10 rows of {generatedData.length}</p>
                  )}
                </TabsContent>
                <TabsContent value="download" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Button onClick={downloadCSV} variant="outline" className="w-full">
                      <Download />
                      Download as CSV
                    </Button>
                    <Button onClick={downloadExcel} variant="outline" className="w-full">
                      <Download />
                      Download as Excel
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Generate a dataset to see preview and download options</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatasetGenerator;
