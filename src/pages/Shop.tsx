import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  condition: string;
  storage: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  in_stock: boolean;
  stock_count: number;
  description: string | null;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedBrands, selectedConditions, selectedCategories, sortBy, showInStockOnly]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (showInStockOnly) {
      filtered = filtered.filter(p => p.in_stock);
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    if (selectedConditions.length > 0) {
      filtered = filtered.filter(p => selectedConditions.includes(p.condition));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredProducts(filtered);
  };

  const brands = Array.from(new Set(products.map(p => p.brand)));
  const conditions = Array.from(new Set(products.map(p => p.condition)));
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              brands={brands}
              conditions={conditions}
              categories={categories}
              selectedBrands={selectedBrands}
              selectedConditions={selectedConditions}
              selectedCategories={selectedCategories}
              showInStockOnly={showInStockOnly}
              onBrandsChange={setSelectedBrands}
              onConditionsChange={setSelectedConditions}
              onCategoriesChange={setSelectedCategories}
              onStockChange={setShowInStockOnly}
              onClearAll={() => {
                setSelectedBrands([]);
                setSelectedConditions([]);
                setSelectedCategories([]);
              }}
            />
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold">
                Showing {filteredProducts.length} Products
              </h1>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-md bg-background"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
