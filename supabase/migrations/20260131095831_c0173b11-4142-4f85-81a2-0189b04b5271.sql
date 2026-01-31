-- Create table for category pricing
CREATE TABLE public.category_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_slug TEXT NOT NULL,
    service_name TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.category_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view category pricing"
ON public.category_pricing
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert category pricing"
ON public.category_pricing
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update category pricing"
ON public.category_pricing
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete category pricing"
ON public.category_pricing
FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_category_pricing_updated_at
BEFORE UPDATE ON public.category_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for category pricing notes (includes/excludes)
CREATE TABLE public.category_pricing_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_slug TEXT NOT NULL UNIQUE,
    includes TEXT[] DEFAULT '{}',
    excludes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.category_pricing_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
CREATE POLICY "Anyone can view pricing notes"
ON public.category_pricing_notes
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert pricing notes"
ON public.category_pricing_notes
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update pricing notes"
ON public.category_pricing_notes
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete pricing notes"
ON public.category_pricing_notes
FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_category_pricing_notes_updated_at
BEFORE UPDATE ON public.category_pricing_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();