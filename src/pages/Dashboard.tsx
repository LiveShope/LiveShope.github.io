import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
  });
  const [brandData, setBrandData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const COLORS = ['#ffc800', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await Promise.all([fetchStats(user.id), fetchChartData(user.id)]);
    } else {
      await fetchPublicData();
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("total_amount, status")
        .eq("user_id", userId);

      if (error) throw error;

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === "pending").length || 0;

      setStats({ totalOrders, totalSpent, pendingOrders });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      });
    }
  };

  const fetchChartData = async (userId: string) => {
    try {
      // First get user's order IDs
      const { data: userOrders, error: ordersError } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", userId);

      if (ordersError) throw ordersError;

      const orderIds = userOrders?.map(o => o.id) || [];

      if (orderIds.length === 0) {
        setLoading(false);
        return;
      }

      // Then get order items for those orders
      const { data: orderItems, error } = await supabase
        .from("order_items")
        .select(`
          product:products(brand, category)
        `)
        .in("order_id", orderIds);

      if (error) throw error;

      // Process brand data
      const brandCounts: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};

      orderItems?.forEach(item => {
        if (item.product) {
          brandCounts[item.product.brand] = (brandCounts[item.product.brand] || 0) + 1;
          categoryCounts[item.product.category] = (categoryCounts[item.product.category] || 0) + 1;
        }
      });

      setBrandData(
        Object.entries(brandCounts).map(([name, value]) => ({ name, value }))
      );
      setCategoryData(
        Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chart data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicData = async () => {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("brand, category, price");

      if (error) throw error;

      // Aggregate brand data
      const brandCounts: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};

      products?.forEach(product => {
        brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      });

      setBrandData(
        Object.entries(brandCounts).map(([name, value]) => ({ name, value }))
      );
      setCategoryData(
        Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))
      );

      setStats({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Product Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Your Orders</p>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Your Total Spent</p>
            <p className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Pending Orders</p>
            <p className="text-3xl font-bold">{stats.pendingOrders}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Products by Brand</h2>
            {brandData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={brandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-16">No data available</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Products by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-16">No data available</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
