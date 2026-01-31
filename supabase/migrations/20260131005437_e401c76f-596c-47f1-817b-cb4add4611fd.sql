-- Create product_media table to store multiple images/videos per product
CREATE TABLE public.product_media (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.category_images(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view product media" 
ON public.product_media 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert product media" 
ON public.product_media 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update product media" 
ON public.product_media 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete product media" 
ON public.product_media 
FOR DELETE 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_media_updated_at
BEFORE UPDATE ON public.product_media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for product_media table
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_media;