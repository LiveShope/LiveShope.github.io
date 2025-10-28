import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ProductFiltersProps {
  brands: string[];
  conditions: string[];
  categories: string[];
  selectedBrands: string[];
  selectedConditions: string[];
  selectedCategories: string[];
  showInStockOnly: boolean;
  onBrandsChange: (brands: string[]) => void;
  onConditionsChange: (conditions: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  onStockChange: (show: boolean) => void;
  onClearAll: () => void;
}

export const ProductFilters = ({
  brands,
  conditions,
  categories,
  selectedBrands,
  selectedConditions,
  selectedCategories,
  showInStockOnly,
  onBrandsChange,
  onConditionsChange,
  onCategoriesChange,
  onStockChange,
  onClearAll,
}: ProductFiltersProps) => {
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionsChange(selectedConditions.filter(c => c !== condition));
    } else {
      onConditionsChange([...selectedConditions, condition]);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const totalFilters = selectedBrands.length + selectedConditions.length + selectedCategories.length;

  return (
    <div className="bg-card p-4 rounded-lg border sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Filters</h2>
        {totalFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {totalFilters > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedBrands.map(brand => (
            <Badge key={brand} variant="secondary" className="cursor-pointer" onClick={() => toggleBrand(brand)}>
              {brand} ×
            </Badge>
          ))}
          {selectedConditions.map(condition => (
            <Badge key={condition} variant="secondary" className="cursor-pointer" onClick={() => toggleCondition(condition)}>
              {condition} ×
            </Badge>
          ))}
          {selectedCategories.map(category => (
            <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() => toggleCategory(category)}>
              {category} ×
            </Badge>
          ))}
        </div>
      )}

      {/* Availability */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStockOnly}
            onCheckedChange={(checked) => onStockChange(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer">
            Show In Stock Only
          </Label>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Condition</h3>
        <div className="space-y-2">
          {conditions.map(condition => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label htmlFor={`condition-${condition}`} className="cursor-pointer">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`category-${category}`} className="cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
