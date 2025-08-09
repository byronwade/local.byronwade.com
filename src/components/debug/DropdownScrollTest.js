"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@components/ui/dropdown-menu";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@components/ui/command";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Check, ChevronDown, TestTube } from "lucide-react";

/**
 * Debug component to test dropdown scrolling behavior
 * This component tests all dropdown components with many items to ensure proper scrolling
 */
export default function DropdownScrollTest() {
  const [selectedValue, setSelectedValue] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  
  // Generate test data with many items
  const testItems = Array.from({ length: 50 }, (_, i) => ({
    id: `item-${i + 1}`,
    label: `Test Item ${i + 1} - This is a longer description for testing scrolling behavior in dropdowns`,
    value: `test-item-${i + 1}`,
    category: i < 15 ? "Category A" : i < 30 ? "Category B" : "Category C"
  }));

  const categories = [
    "Technology & Software",
    "Healthcare & Medical",
    "Finance & Banking", 
    "Education & Training",
    "Retail & E-commerce",
    "Manufacturing & Industrial",
    "Real Estate & Property",
    "Food & Beverage",
    "Transportation & Logistics",
    "Marketing & Advertising",
    "Consulting & Professional Services",
    "Entertainment & Media",
    "Construction & Engineering",
    "Energy & Utilities",
    "Agriculture & Farming",
    "Automotive & Vehicles",
    "Beauty & Personal Care",
    "Sports & Recreation",
    "Non-profit & Charity",
    "Government & Public Sector"
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <TestTube className="w-8 h-8" />
          Dropdown Scroll Test
        </h1>
        <p className="text-muted-foreground mt-2">
          Testing all dropdown components with many items to verify proper scrolling behavior
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Select Component Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Component</CardTitle>
            <p className="text-sm text-muted-foreground">Testing Radix UI Select with 20+ categories</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedValue && (
              <Badge variant="outline" className="text-xs">
                Selected: {selectedValue}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* DropdownMenu Component Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">DropdownMenu Component</CardTitle>
            <p className="text-sm text-muted-foreground">Testing Radix UI DropdownMenu with 50+ items</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Choose Test Item
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                <DropdownMenuLabel>All Test Items (50 items)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {testItems.map((item) => (
                  <DropdownMenuItem key={item.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Command Component Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Command Component</CardTitle>
            <p className="text-sm text-muted-foreground">Testing CMDK Command with search and scrolling</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => setCommandOpen(!commandOpen)}
                className="w-full justify-between"
              >
                Search Items
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
              
              {commandOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-card border rounded-md shadow-lg">
                  <Command>
                    <CommandInput placeholder="Search test items..." />
                    <CommandList>
                      <CommandEmpty>No items found.</CommandEmpty>
                      <CommandGroup heading="Category A">
                        {testItems.filter(item => item.category === "Category A").map((item) => (
                          <CommandItem key={item.id} value={item.value}>
                            <Check className="mr-2 h-4 w-4 opacity-0" />
                            <div className="flex flex-col">
                              <span>{item.label}</span>
                              <span className="text-xs text-muted-foreground">{item.value}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandGroup heading="Category B">
                        {testItems.filter(item => item.category === "Category B").map((item) => (
                          <CommandItem key={item.id} value={item.value}>
                            <Check className="mr-2 h-4 w-4 opacity-0" />
                            <div className="flex flex-col">
                              <span>{item.label}</span>
                              <span className="text-xs text-muted-foreground">{item.value}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandGroup heading="Category C">
                        {testItems.filter(item => item.category === "Category C").map((item) => (
                          <CommandItem key={item.id} value={item.value}>
                            <Check className="mr-2 h-4 w-4 opacity-0" />
                            <div className="flex flex-col">
                              <span>{item.label}</span>
                              <span className="text-xs text-muted-foreground">{item.value}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Click outside to close the command menu
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Test Checklist</CardTitle>
          <p className="text-sm text-muted-foreground">
            Verify these behaviors work correctly:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Select Component:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Dropdown opens with proper max height</li>
                <li>✓ Scrolling works smoothly within dropdown</li>
                <li>✓ Scroll buttons appear when needed</li>
                <li>✓ No content overflow outside bounds</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">DropdownMenu Component:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Dropdown respects viewport height</li>
                <li>✓ Smooth scrolling within menu items</li>
                <li>✓ Proper backdrop and positioning</li>
                <li>✓ Items are clickable throughout scroll</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Command Component:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Search filtering works correctly</li>
                <li>✓ CommandList scrolls properly</li>
                <li>✓ Grouped items maintain structure</li>
                <li>✓ No layout overflow issues</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">General Behavior:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ All dropdowns close on outside click</li>
                <li>✓ Keyboard navigation works</li>
                <li>✓ Focus management is correct</li>
                <li>✓ Mobile responsiveness maintained</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
