import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface FilterToolbarProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: string;
  priceMin: number;
  priceMax: number;
  commissionMin: number;
  commissionMax: number;
  sortBy: string;
}

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Beauty",
  "Books",
  "Toys",
];

const SORT_OPTIONS = [
  { value: "commission-high", label: "Highest Commission" },
  { value: "price-low", label: "Lowest Price" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
];

export default function FilterToolbar({ onFiltersChange }: FilterToolbarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All Categories",
    priceMin: 0,
    priceMax: 100000,
    commissionMin: 0,
    commissionMax: 20,
    sortBy: "commission-high",
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      search: "",
      category: "All Categories",
      priceMin: 0,
      priceMax: 100000,
      commissionMin: 0,
      commissionMax: 20,
      sortBy: "commission-high",
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  return (
    <Card className="p-6 bg-card border border-border">
      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search Product
          </label>
          <Input
            type="text"
            placeholder="Search product name..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Select */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Price Range: ฿{filters.priceMin.toLocaleString()} - ฿
            {filters.priceMax.toLocaleString()}
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Min price"
                value={filters.priceMin}
                onChange={(e) =>
                  handleFilterChange("priceMin", Number(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Max price"
                value={filters.priceMax}
                onChange={(e) =>
                  handleFilterChange("priceMax", Number(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
          <Slider
            min={0}
            max={100000}
            step={1000}
            value={[filters.priceMin, filters.priceMax]}
            onValueChange={(value) => {
              handleFilterChange("priceMin", value[0]);
              handleFilterChange("priceMax", value[1]);
            }}
            className="w-full"
          />
        </div>

        {/* Commission Rate Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Commission Rate: {filters.commissionMin.toFixed(1)}% - {filters.commissionMax.toFixed(1)}%
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Min %"
                value={filters.commissionMin}
                onChange={(e) =>
                  handleFilterChange("commissionMin", Number(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Max %"
                value={filters.commissionMax}
                onChange={(e) =>
                  handleFilterChange("commissionMax", Number(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
          <Slider
            min={0}
            max={20}
            step={0.5}
            value={[filters.commissionMin, filters.commissionMax]}
            onValueChange={(value) => {
              handleFilterChange("commissionMin", value[0]);
              handleFilterChange("commissionMax", value[1]);
            }}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}
