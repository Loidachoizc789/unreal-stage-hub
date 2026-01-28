-- 1. Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- 5. RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.is_admin());

-- 6. Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view categories
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

-- Only admins can modify categories
CREATE POLICY "Admins can insert categories"
ON public.categories FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
ON public.categories FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE
USING (public.is_admin());

-- 7. Create category_images table
CREATE TABLE public.category_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on category_images
ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;

-- Everyone can view images
CREATE POLICY "Anyone can view category images"
ON public.category_images FOR SELECT
USING (true);

-- Only admins can modify images
CREATE POLICY "Admins can insert category images"
ON public.category_images FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update category images"
ON public.category_images FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete category images"
ON public.category_images FOR DELETE
USING (public.is_admin());

-- 8. Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true);

-- Storage policies
CREATE POLICY "Anyone can view category images storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Admins can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'category-images' AND public.is_admin());

CREATE POLICY "Admins can update category images storage"
ON storage.objects FOR UPDATE
USING (bucket_id = 'category-images' AND public.is_admin());

CREATE POLICY "Admins can delete category images storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'category-images' AND public.is_admin());

-- 9. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply trigger to tables
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_category_images_updated_at
BEFORE UPDATE ON public.category_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Insert default categories
INSERT INTO public.categories (slug, name, description, display_order) VALUES
('3d-studios', 'Phim Trường 3D / Virtual Production', 'Talkshow, Livestream bán hàng, TV show, Event – sân khấu ảo, Showroom ảo', 1),
('2d-design', 'Thiết Kế 2D', 'Key visual chương trình, Backdrop sự kiện, Visual livestream, Layout màn LED, POSM & social visual', 2),
('3d-models', 'Model 3D / Asset', 'Props sân khấu, Nội thất 3D, Background modular, Asset tối ưu UE5 / Blender', 3),
('interior-exterior', 'Thiết Kế Nội Ngoại Thất', 'Render 3D nội thất căn hộ, biệt thự, văn phòng và phối cảnh ngoại thất', 4),
('after-effects', 'After Effects / Motion Graphics', 'Motion logo, video quảng cáo, template AE, gói livestream visual', 5);