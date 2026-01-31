import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { GalleryItem } from "@/components/ProductGallery";

interface CategoryImage {
  id: string;
  category_slug: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
}

export function useCategoryImages(categorySlug: string) {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("category_images")
        .select("*")
        .eq("category_slug", categorySlug)
        .order("display_order");

      if (error) throw error;

      const galleryItems: GalleryItem[] = (data || []).map((img: CategoryImage) => ({
        id: img.id,
        title: img.title,
        description: img.description || "",
        image: img.image_url,
      }));

      setImages(galleryItems);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch images"));
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    fetchImages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`category-images-${categorySlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'category_images',
          filter: `category_slug=eq.${categorySlug}`,
        },
        () => {
          // Refetch when any change happens
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categorySlug, fetchImages]);

  return { images, isLoading, error, refetch: fetchImages };
}

// Hook to fetch all images grouped by category
export function useAllCategoryImages() {
  const [imagesByCategory, setImagesByCategory] = useState<Record<string, GalleryItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("category_images")
        .select("*")
        .order("display_order");

      if (error) throw error;

      const grouped: Record<string, GalleryItem[]> = {};
      (data || []).forEach((img: CategoryImage) => {
        if (!grouped[img.category_slug]) {
          grouped[img.category_slug] = [];
        }
        grouped[img.category_slug].push({
          id: img.id,
          title: img.title,
          description: img.description || "",
          image: img.image_url,
        });
      });

      setImagesByCategory(grouped);
    } catch (err) {
      console.error("Failed to fetch category images:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllImages();

    // Subscribe to real-time changes for all categories
    const channel = supabase
      .channel('all-category-images')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'category_images',
        },
        () => {
          fetchAllImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllImages]);

  return { imagesByCategory, isLoading, refetch: fetchAllImages };
}
