import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PriceItem {
  label: string;
  price: string;
}

interface ServiceGroup {
  name: string;
  items: PriceItem[];
}

interface PricingData {
  services: ServiceGroup[];
  includes?: string[];
  excludes?: string[];
}

export const useCategoryPricing = (categorySlug: string) => {
  const { data: pricing, isLoading: pricingLoading } = useQuery({
    queryKey: ["category-pricing", categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_pricing")
        .select("*")
        .eq("category_slug", categorySlug)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["category-pricing-notes", categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_pricing_notes")
        .select("*")
        .eq("category_slug", categorySlug)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      return data;
    },
  });

  // Transform database data to component format
  const pricingData: PricingData | null = pricing && pricing.length > 0
    ? {
        services: pricing.map((p) => ({
          name: p.service_name,
          items: (p.items as unknown as PriceItem[]) || [],
        })),
        includes: notes?.includes || undefined,
        excludes: notes?.excludes || undefined,
      }
    : null;

  return {
    pricingData,
    isLoading: pricingLoading || notesLoading,
  };
};
