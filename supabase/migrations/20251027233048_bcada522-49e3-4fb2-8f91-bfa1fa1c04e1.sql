-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  storage TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cart items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- Cart policies
CREATE POLICY "Users can view their own cart items"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample products
INSERT INTO public.products (name, brand, category, condition, storage, price, original_price, in_stock, stock_count, description) VALUES
('iPhone 15 Pro Max', 'Apple', 'Mobile Phones', 'Pristine', '256GB', 1299.00, 1499.00, true, 15, 'Latest iPhone with A17 Pro chip'),
('iPhone 14 Pro', 'Apple', 'Mobile Phones', 'Mint', '128GB', 999.00, 1199.00, true, 22, 'Previous generation flagship'),
('Samsung Galaxy S24 Ultra', 'Samsung', 'Mobile Phones', 'Pristine', '512GB', 1199.00, 1399.00, true, 18, 'Premium Android flagship'),
('Google Pixel 8 Pro', 'Google', 'Mobile Phones', 'Mint', '256GB', 899.00, 999.00, true, 12, 'Best camera phone'),
('OnePlus 12', 'OnePlus', 'Mobile Phones', 'Pristine', '256GB', 799.00, 899.00, true, 8, 'Fast charging flagship'),
('Xiaomi 14 Pro', 'Xiaomi', 'Mobile Phones', 'Satisfactory', '256GB', 699.00, 799.00, true, 25, 'Value flagship phone'),
('iPhone 13', 'Apple', 'Mobile Phones', 'Mint', '128GB', 699.00, 799.00, true, 30, 'Reliable iPhone model'),
('Samsung Galaxy S23', 'Samsung', 'Mobile Phones', 'Pristine', '256GB', 849.00, 999.00, true, 14, 'Previous flagship'),
('iPad Pro 12.9"', 'Apple', 'Tablets', 'Pristine', '256GB', 1099.00, 1299.00, true, 7, 'Professional tablet'),
('iPad Air', 'Apple', 'Tablets', 'Mint', '128GB', 599.00, 699.00, true, 11, 'Lightweight tablet'),
('Samsung Galaxy Tab S9', 'Samsung', 'Tablets', 'Pristine', '256GB', 799.00, 899.00, true, 9, 'Premium Android tablet'),
('Apple Watch Series 9', 'Apple', 'Watches', 'Pristine', '45mm', 449.00, 499.00, true, 20, 'Latest smartwatch'),
('Apple Watch SE', 'Apple', 'Watches', 'Mint', '40mm', 279.00, 329.00, true, 16, 'Affordable Apple Watch'),
('AirPods Pro 2', 'Apple', 'Earphones', 'Pristine', NULL, 249.00, 279.00, true, 35, 'Premium earbuds'),
('Samsung Galaxy Buds Pro', 'Samsung', 'Earphones', 'Mint', NULL, 149.00, 199.00, true, 28, 'Android earbuds');
