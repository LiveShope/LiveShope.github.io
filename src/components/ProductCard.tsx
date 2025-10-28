import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: {
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
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const addToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();

      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Added to cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "pristine":
        return "bg-green-500";
      case "mint":
        return "bg-blue-500";
      case "satisfactory":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-muted flex items-center justify-center p-4">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-6xl">📱</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">{product.brand}</Badge>
          <Badge className={`text-xs ${getConditionColor(product.condition)} text-white`}>
            {product.condition}
          </Badge>
        </div>

        <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
        
        {product.storage && (
          <p className="text-sm text-muted-foreground mb-2">{product.storage}</p>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold">${product.price}</span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.original_price}
            </span>
          )}
        </div>

        <Button
          className="w-full"
          onClick={addToCart}
          disabled={!product.in_stock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.in_stock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};
