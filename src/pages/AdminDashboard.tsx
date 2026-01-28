import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Upload, Trash2, Edit, Plus, Image, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface CategoryImage {
  id: string;
  category_slug: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<CategoryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);

  useEffect(() => {
    checkAuth();
    fetchCategories();
    fetchImages();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      navigate("/admin/login");
      return;
    }

    setIsAdmin(true);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    if (data) setCategories(data);
  };

  const fetchImages = async () => {
    const { data } = await supabase
      .from("category_images")
      .select("*")
      .order("display_order");
    if (data) setImages(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFile && !editingImage) {
      toast({ title: "Vui lòng chọn file ảnh", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = editingImage?.image_url || "";

      if (formFile) {
        const fileExt = formFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${formCategory}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(filePath, formFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      if (editingImage) {
        const { error } = await supabase
          .from("category_images")
          .update({
            title: formTitle,
            description: formDescription,
            category_slug: formCategory,
            image_url: imageUrl,
          })
          .eq("id", editingImage.id);

        if (error) throw error;
        toast({ title: "Cập nhật ảnh thành công!" });
      } else {
        const { error } = await supabase
          .from("category_images")
          .insert({
            title: formTitle,
            description: formDescription,
            category_slug: formCategory,
            image_url: imageUrl,
            display_order: images.length,
          });

        if (error) throw error;
        toast({ title: "Thêm ảnh thành công!" });
      }

      resetForm();
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (image: CategoryImage) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    try {
      const { error } = await supabase
        .from("category_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      toast({ title: "Xóa ảnh thành công!" });
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (image: CategoryImage) => {
    setEditingImage(image);
    setFormTitle(image.title);
    setFormDescription(image.description || "");
    setFormCategory(image.category_slug);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormCategory("");
    setFormFile(null);
    setEditingImage(null);
    setIsDialogOpen(false);
  };

  const filteredImages = selectedCategory === "all"
    ? images
    : images.filter((img) => img.category_slug === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Về trang chủ
              </Button>
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Quản Lý <span className="gradient-text">Ảnh</span>
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Lọc theo danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4" />
                Thêm ảnh mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingImage ? "Chỉnh sửa ảnh" : "Thêm ảnh mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select value={formCategory} onValueChange={setFormCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">
                    {editingImage ? "Thay đổi ảnh (tùy chọn)" : "Chọn ảnh"}
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                    required={!editingImage}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={isUploading} className="flex-1">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : editingImage ? (
                      "Cập nhật"
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Tải lên
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Hủy
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden group">
                <div className="relative aspect-video">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(image)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(image)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs bg-primary/90 rounded text-primary-foreground">
                      {categories.find((c) => c.slug === image.category_slug)?.name || image.category_slug}
                    </span>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{image.title}</h3>
                  {image.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{image.description}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có ảnh nào</h3>
            <p className="text-muted-foreground">Bấm "Thêm ảnh mới" để bắt đầu.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
