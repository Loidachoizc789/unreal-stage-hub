import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
  category?: string;
}

interface MediaItem {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  display_order: number;
}

interface ProductGalleryProps {
  items: GalleryItem[];
}

const ProductGallery = forwardRef<HTMLDivElement, ProductGalleryProps>(({ items }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [productMedia, setProductMedia] = useState<MediaItem[]>([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  // Fetch additional media when a product is selected
  useEffect(() => {
    if (selectedItem) {
      fetchProductMedia(selectedItem.id.toString());
    } else {
      setProductMedia([]);
      setSelectedMediaIndex(0);
    }
  }, [selectedItem?.id]);

  const fetchProductMedia = async (productId: string) => {
    setIsLoadingMedia(true);
    const { data, error } = await supabase
      .from("product_media")
      .select("*")
      .eq("product_id", productId)
      .order("display_order");

    if (!error && data) {
      const typedData: MediaItem[] = data.map((item) => ({
        id: item.id,
        media_url: item.media_url,
        media_type: item.media_type as "image" | "video",
        display_order: item.display_order,
      }));
      setProductMedia(typedData);
    }
    setIsLoadingMedia(false);
  };

  // Combine main image with additional media
  const allMedia: MediaItem[] = selectedItem
    ? [
        { id: "main", media_url: selectedItem.image, media_type: "image" as const, display_order: -1 },
        ...productMedia,
      ]
    : [];

  const currentMedia = allMedia[selectedMediaIndex];

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? items.length - 1 : selectedIndex - 1);
      setSelectedMediaIndex(0);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === items.length - 1 ? 0 : selectedIndex + 1);
      setSelectedMediaIndex(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => {
              setSelectedIndex(index);
              setSelectedMediaIndex(0);
            }}
          >
            <div className="glass-card overflow-hidden card-hover">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                {item.category && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground">
                      {item.category}
                    </span>
                  </div>
                )}

                {/* View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">Xem</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent 
          className="max-w-5xl w-[95vw] p-0 gap-0 bg-card/95 backdrop-blur-xl border-border/50"
          onKeyDown={handleKeyDown}
        >
          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Main Media Display */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-black">
                  {isLoadingMedia ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : currentMedia?.media_type === "video" ? (
                    <video
                      src={currentMedia.media_url}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={currentMedia?.media_url || selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                  
                  {/* Navigation Arrows */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  {/* Category Badge */}
                  {selectedItem.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 text-sm font-medium bg-primary rounded-full text-primary-foreground">
                        {selectedItem.category}
                      </span>
                    </div>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm rounded-full">
                      {selectedIndex !== null ? selectedIndex + 1 : 0} / {items.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Grid - Only show if there are multiple media */}
                {allMedia.length > 1 && (
                  <div className="px-6 py-3 bg-muted/50 border-t border-border/50">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allMedia.map((media, index) => (
                        <button
                          key={media.id}
                          onClick={() => setSelectedMediaIndex(index)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedMediaIndex === index
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-transparent hover:border-muted-foreground/50"
                          }`}
                        >
                          {media.media_type === "video" ? (
                            <>
                              <video
                                src={media.media_url}
                                className="w-full h-full object-cover"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            </>
                          ) : (
                            <img
                              src={media.media_url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display">
                      {selectedItem.title}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground mt-2">
                      {selectedItem.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex gap-3 mt-6">
                    <Button variant="hero" asChild>
                      <a href="tel:0862098408">Liên hệ báo giá</a>
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedIndex(null)}>
                      Đóng
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
});

ProductGallery.displayName = "ProductGallery";

export default ProductGallery;
