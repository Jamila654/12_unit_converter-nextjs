"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ConversionMap = Record<string, Record<string, number>>;

const conversions: Record<string, ConversionMap> = {
  length: {
    meter: { kilometer: 0.001, centimeter: 100, inch: 39.37, foot: 3.281, yard: 1.094, mile: 0.000621 },
    kilometer: { meter: 1000, centimeter: 100000, inch: 39370, foot: 3281, yard: 1094, mile: 0.6214 },
    centimeter: { meter: 0.01, kilometer: 0.00001, inch: 0.3937, foot: 0.03281, yard: 0.01094, mile: 0.000006214 },
    inch: { meter: 0.0254, kilometer: 0.0000254, centimeter: 2.54, foot: 0.08333, yard: 0.02778, mile: 0.00001578 },
    foot: { meter: 0.3048, kilometer: 0.0003048, centimeter: 30.48, inch: 12, yard: 0.3333, mile: 0.0001894 },
    yard: { meter: 0.9144, kilometer: 0.0009144, centimeter: 91.44, inch: 36, foot: 3, mile: 0.0005682 },
    mile: { meter: 1609, kilometer: 1.609, centimeter: 160934, inch: 63360, foot: 5280, yard: 1760 },
  },
  weight: {
    kilogram: { gram: 1000, pound: 2.205, ounce: 35.274, stone: 0.1575 },
    gram: { kilogram: 0.001, pound: 0.002205, ounce: 0.03527, stone: 0.0001575 },
    pound: { kilogram: 0.4536, gram: 453.6, ounce: 16, stone: 0.07143 },
    ounce: { kilogram: 0.02835, gram: 28.35, pound: 0.0625, stone: 0.004464 },
    stone: { kilogram: 6.35, gram: 6350, pound: 14, ounce: 224 },
  },
  volume: {
    liter: { milliliter: 1000, gallon: 0.2642, cup: 4.2268, pint: 2.113, quart: 1.057 },
    milliliter: { liter: 0.001, gallon: 0.0002642, cup: 0.004227, pint: 0.002113, quart: 0.001057 },
    gallon: { liter: 3.785, milliliter: 3785, cup: 16, pint: 8, quart: 4 },
    cup: { liter: 0.2366, milliliter: 236.6, gallon: 0.0625, pint: 0.5, quart: 0.25 },
    pint: { liter: 0.4732, milliliter: 473.2, gallon: 0.125, cup: 2, quart: 0.5 },
    quart: { liter: 0.9464, milliliter: 946.4, gallon: 0.25, cup: 4, pint: 2 },
  },
};

const categories = {
  length: ["meter", "kilometer", "centimeter", "inch", "foot", "yard", "mile"],
  weight: ["kilogram", "gram", "pound", "ounce", "stone"],
  volume: ["liter", "milliliter", "gallon", "cup", "pint", "quart"],
} as const;

type Category = keyof typeof categories;

export default function Home() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [value, setValue] = useState<number | string>("");
  const [convertedValue, setConvertedValue] = useState<number | string>(0);

  const handleConvert = () => {
    if (!fromUnit || !toUnit || !value) {
      alert("Please select units and enter a value.");
      return;
    }

    const fromConversions = conversions[category][fromUnit];
    const conversionRate = fromConversions?.[toUnit];

    if (conversionRate !== undefined) {
      const result = parseFloat(value as string) * conversionRate;
      setConvertedValue(result.toFixed(2));
    } else {
      alert("Conversion not available.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 -ml-7 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card>
          <CardHeader className=" text-center">
            <CardTitle>Unit Converter</CardTitle>
            <CardDescription>
              Convert values between different units.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-5">
            <div className="category">
              <h1>Category</h1>
              <Select onValueChange={(value) => setCategory(value as Category)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories).map((categoryKey) => (
                    <SelectItem key={categoryKey} value={categoryKey}>
                      {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="from">
              <h1>From</h1>
              <Select onValueChange={(value) => setFromUnit(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {categories[category].map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="to">
              <h1>To</h1>
              <Select onValueChange={(value) => setToUnit(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {categories[category].map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className=" flex flex-col gap-5">
            <div className="value w-full">
              <h1>Value</h1>
              <Input
                type="number"
                placeholder="Enter value"
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <Button className=" w-full" onClick={handleConvert}>Convert</Button>
            <div className="result w-full">
              <h1>Converted Value</h1>
              <Input readOnly value={convertedValue} />
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}




