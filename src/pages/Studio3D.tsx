import { motion } from "framer-motion";
import { Video, Zap, Monitor, Sun, Move, Phone, Mail, CheckCircle, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/ProductGallery";
import CategoryNavbar from "@/components/CategoryNavbar";
import Footer from "@/components/sections/Footer";
import { useCategoryImages } from "@/hooks/useCategoryImages";
import setTalkshow from "@/assets/set-talkshow.jpg";

// Fallback images for when database is empty
const fallbackImages = [
  { id: 1, title: "Set Talkshow", description: "Phim trường 3D cho chương trình talkshow", image: setTalkshow },
];

const deliverables = [
  "File Unreal Engine 5 project hoàn chỉnh",
  "File Aximmetry project (nếu yêu cầu)",
  "Hướng dẫn setup và sử dụng",
  "Camera preset sẵn sàng",
  "Lighting setup tối ưu",
  "Asset props đi kèm",
  "Template thay đổi brand/logo",
  "Hỗ trợ kỹ thuật sau bàn giao",
];

const features = [
  { icon: Zap, title: "Realtime Render", description: "Render trực tiếp không cần chờ đợi, phù hợp livestream" },
  { icon: Monitor, title: "Camera Tracking", description: "Hỗ trợ NDI, Stype, Mo-Sys và các hệ thống tracking phổ biến" },
  { icon: Sun, title: "Ánh Sáng Tối Ưu", description: "Lighting setup sẵn, dễ điều chỉnh theo nhu cầu từng scene" },
  { icon: Move, title: "Linh Hoạt Thay Đổi", description: "Dễ dàng đổi layout, vật liệu, màu sắc theo brand guideline" },
];

const specs = [
  { label: "Engine", value: "Unreal Engine 5.3+" },
  { label: "Render", value: "Realtime / Path Tracing" },
  { label: "Tracking", value: "NDI, Stype, Mo-Sys, FreeD" },
  { label: "Output", value: "1080p / 4K / 8K" },
  { label: "Platform", value: "UE5, Aximmetry, Disguise" },
  { label: "Format", value: ".uproject, .axm" },
];

const Studio3D = () => {
  const { images, isLoading } = useCategoryImages("phim-truong-3d");
  const galleryItems = images.length > 0 ? images : fallbackImages;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CategoryNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 grid-pattern opacity-5" />
        
        <div className="section-container relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                Virtual Production
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Phim Trường <span className="gradient-text">3D / Virtual Production</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Giải pháp phim trường ảo cho Talkshow, Livestream, TV Show và Event – 
              render realtime trên Unreal Engine 5 & Aximmetry, sẵn sàng cho mọi quy mô sản xuất.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">
                  <Phone className="w-5 h-5" />
                  Liên hệ báo giá
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#gallery">
                  <Play className="w-5 h-5" />
                  Xem phim trường
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Thư Viện <span className="gradient-text">Phim Trường</span>
            </h2>
            <p className="text-muted-foreground">
              Khám phá các mẫu phim trường 3D đã triển khai. Click vào hình để xem chi tiết.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProductGallery items={galleryItems} />
          )}
        </div>
      </section>

      {/* Specs Section */}
      <section className="py-16 bg-card/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Thông Số <span className="gradient-text">Kỹ Thuật</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-card p-4 text-center"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{spec.label}</p>
                <p className="font-semibold text-primary">{spec.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Sản Phẩm <span className="gradient-text">Bàn Giao</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Khi mua phim trường 3D, bạn sẽ nhận được bộ sản phẩm hoàn chỉnh để sử dụng ngay.
              </p>

              <div className="grid gap-4">
                {deliverables.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img 
                  src={setTalkshow} 
                  alt="Virtual production studio" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-24 bg-card/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Bắt đầu với <span className="gradient-text">Phim Trường 3D</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Liên hệ ngay để nhận tư vấn và báo giá chi tiết cho dự án virtual production của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="hero" size="xl" asChild>
                <a href="tel:0862098408">
                  <Phone className="w-5 h-5" />
                  0862 098 408
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="mailto:designhomekey@gmail.com">
                  <Mail className="w-5 h-5" />
                  designhomekey@gmail.com
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Zalo: 0862 098 408 · Hỗ trợ kỹ thuật 24/7
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Studio3D;
