import { useState, useEffect } from "react";
import { Plus, Trash2, Upload, Loader2, Image, Video, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MediaItem {
  id: string;
  product_id: string;
  media_url: string;
  media_type: "image" | "video";
  display_order: number;
}

interface ProductMediaManagerProps {
  productId: string;
  onClose: () => void;
}

const ProductMediaManager = ({ productId, onClose }: ProductMediaManagerProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, [productId]);

  const fetchMedia = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("product_media")
      .select("*")
      .eq("product_id", productId)
      .order("display_order");

    if (error) {
      console.error("Error fetching media:", error);
    } else if (data) {
      const typedData: MediaItem[] = data.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        media_url: item.media_url,
        media_type: item.media_type as "image" | "video",
        display_order: item.display_order,
      }));
      setMediaItems(typedData);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop()?.toLowerCase();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const filePath = `products/${productId}/${fileName}`;

        // Determine media type
        const isVideo = ["mp4", "webm", "mov", "avi"].includes(fileExt || "");
        const mediaType = isVideo ? "video" : "image";

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(filePath);

        // Insert into database
        const { error: insertError } = await supabase
          .from("product_media")
          .insert({
            product_id: productId,
            media_url: urlData.publicUrl,
            media_type: mediaType,
            display_order: mediaItems.length + i,
          });

        if (insertError) throw insertError;
      }

      toast({ title: `Đã tải lên ${files.length} file thành công!` });
      fetchMedia();
    } catch (error: any) {
      toast({
        title: "Lỗi tải lên",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Bạn có chắc muốn xóa media này?")) return;

    try {
      const { error } = await supabase
        .from("product_media")
        .delete()
        .eq("id", mediaId);

      if (error) throw error;

      toast({ title: "Đã xóa thành công!" });
      fetchMedia();
    } catch (error: any) {
      toast({
        title: "Lỗi xóa",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Quản lý Media ({mediaItems.length})</h3>
        <div className="relative">
          <Input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button disabled={isUploading} size="sm" className="gap-2">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Thêm ảnh/video
              </>
            )}
          </Button>
        </div>
      </div>

      {mediaItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chưa có media nào. Bấm "Thêm ảnh/video" để bắt đầu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mediaItems.map((item, index) => (
            <div
              key={item.id}
              className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-muted"
            >
              {item.media_type === "video" ? (
                <video
                  src={item.media_url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={item.media_url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Media type indicator */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 text-xs bg-black/60 rounded flex items-center gap-1 text-white">
                  {item.media_type === "video" ? (
                    <Video className="w-3 h-3" />
                  ) : (
                    <Image className="w-3 h-3" />
                  )}
                  {index + 1}
                </span>
              </div>

              {/* Delete button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default ProductMediaManager;
