import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchImages = async () => {
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
    };

    fetchImages();
  }, [categorySlug]);

  return { images, isLoading, error };
}

// Hook to fetch all images grouped by category
export function useAllCategoryImages() {
  const [imagesByCategory, setImagesByCategory] = useState<Record<string, GalleryItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllImages = async () => {
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
    };

    fetchAllImages();
  }, []);

  return { imagesByCategory, isLoading };
}
