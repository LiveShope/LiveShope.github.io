import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingCart, User, LogOut, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-2xl">
              📱
            </div>
            <span className="text-xl font-bold">MobileShop</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            {user && (
              <>
                <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/orders" className="hover:text-primary transition-colors">Orders</Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default">
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        <nav className="md:hidden flex items-center space-x-4 pb-4 overflow-x-auto">
          <Link to="/" className="text-sm hover:text-primary transition-colors whitespace-nowrap">Home</Link>
          <Link to="/shop" className="text-sm hover:text-primary transition-colors whitespace-nowrap">Shop</Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-sm hover:text-primary transition-colors whitespace-nowrap">Dashboard</Link>
              <Link to="/orders" className="text-sm hover:text-primary transition-colors whitespace-nowrap">Orders</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
