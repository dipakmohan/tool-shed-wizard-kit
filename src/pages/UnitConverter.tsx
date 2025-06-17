
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from 'lucide-react';

const conversionConfig = {
  length: {
    name: "Length",
    units: { 
      m: "Meters", 
      km: "Kilometers", 
      cm: "Centimeters", 
      mm: "Millimeters",
      mi: "Miles", 
      ft: "Feet", 
      in: "Inches",
      yd: "Yards"
    },
    conversions: {
      m: 1, 
      km: 1000, 
      cm: 0.01, 
      mm: 0.001,
      mi: 1609.34, 
      ft: 0.3048, 
      in: 0.0254,
      yd: 0.9144
    },
  },
  weight: {
    name: "Weight",
    units: { 
      kg: "Kilograms", 
      g: "Grams", 
      mg: "Milligrams",
      lb: "Pounds", 
      oz: "Ounces",
      ton: "Tonnes"
    },
    conversions: { 
      kg: 1, 
      g: 0.001, 
      mg: 0.000001,
      lb: 0.453592, 
      oz: 0.0283495,
      ton: 1000
    },
  },
  volume: {
    name: "Volume",
    units: {
      l: "Liters",
      ml: "Milliliters",
      gal: "Gallons (US)",
      qt: "Quarts (US)",
      pt: "Pints (US)",
      cup: "Cups (US)",
      fl_oz: "Fluid Ounces (US)",
      m3: "Cubic Meters"
    },
    conversions: {
      l: 1,
      ml: 0.001,
      gal: 3.78541,
      qt: 0.946353,
      pt: 0.473176,
      cup: 0.236588,
      fl_oz: 0.0295735,
      m3: 1000
    },
  },
  area: {
    name: "Area",
    units: {
      m2: "Square Meters",
      km2: "Square Kilometers",
      cm2: "Square Centimeters",
      ft2: "Square Feet",
      in2: "Square Inches",
      acre: "Acres",
      hectare: "Hectares"
    },
    conversions: {
      m2: 1,
      km2: 1000000,
      cm2: 0.0001,
      ft2: 0.092903,
      in2: 0.00064516,
      acre: 4046.86,
      hectare: 10000
    },
  },
  temperature: {
    name: "Temperature",
    units: { c: "Celsius", f: "Fahrenheit", k: "Kelvin" },
    conversions: {
      c: { toBase: (val: number) => val, fromBase: (val: number) => val },
      f: { toBase: (val: number) => (val - 32) * 5/9, fromBase: (val: number) => (val * 9/5) + 32 },
      k: { toBase: (val: number) => val - 273.15, fromBase: (val: number) => val + 273.15 },
    },
  },
  speed: {
    name: "Speed",
    units: {
      mps: "Meters per Second",
      kph: "Kilometers per Hour",
      mph: "Miles per Hour",
      fps: "Feet per Second",
      knot: "Knots"
    },
    conversions: {
      mps: 1,
      kph: 0.277778,
      mph: 0.44704,
      fps: 0.3048,
      knot: 0.514444
    },
  },
};

type Category = keyof typeof conversionConfig;

const UnitConverter = () => {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [inputValue, setInputValue] = useState("1");

  const currentCategory = conversionConfig[category];
  const units = currentCategory.units;

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const newUnits = Object.keys(conversionConfig[newCategory].units);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
    setInputValue("1");
  };

  const convertedValue = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "";

    if (category === 'temperature') {
      const tempConversions = currentCategory.conversions as any;
      const baseValue = tempConversions[fromUnit].toBase(value);
      return tempConversions[toUnit].fromBase(baseValue).toFixed(6).replace(/\.?0+$/, '');
    }
    
    const baseValue = value * (currentCategory.conversions as any)[fromUnit];
    const result = baseValue / (currentCategory.conversions as any)[toUnit];
    return result.toFixed(6).replace(/\.?0+$/, '');

  }, [inputValue, fromUnit, toUnit, category, currentCategory]);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Unit Converter</h1>
        <p className="text-muted-foreground">Quickly convert between different units of measurement.</p>
      </div>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Select Conversion</CardTitle>
          <CardDescription>Choose a category and units to convert.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => handleCategoryChange(val as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(conversionConfig).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger id="from"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(units).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value to convert"
              />
            </div>

            <div className="flex items-center justify-center">
                <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
               <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger id="to"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(units).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                value={convertedValue} 
                readOnly 
                className="bg-muted/50"
                placeholder="Converted value"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitConverter;
