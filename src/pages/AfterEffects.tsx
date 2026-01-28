import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Film, Play, Sparkles, Video, Tv, Zap, Clock, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import ProductGallery from "@/components/ProductGallery";

// Static placeholder images - will be replaced by database images
const motionItems = [
  { id: 1, title: "Logo Intro Animation", image: "/placeholder.svg", description: "Logo reveal 5-7s với hiệu ứng particles" },
  { id: 2, title: "Outro Bumper", image: "/placeholder.svg", description: "Kết thúc video chuyên nghiệp" },
  { id: 3, title: "Text Animation", image: "/placeholder.svg", description: "Typography motion đơn giản" },
];

const livestreamItems = [
  { id: 1, title: "Lower Third Pack", image: "/placeholder.svg", description: "Gói lower third đa dạng mẫu" },
  { id: 2, title: "Livestream Frame", image: "/placeholder.svg", description: "Khung livestream với overlay" },
  { id: 3, title: "Countdown Timer", image: "/placeholder.svg", description: "Đếm ngược intro livestream" },
];

const videoItems = [
  { id: 1, title: "Social Video 15s", image: "/placeholder.svg", description: "Video quảng cáo ngắn cho social" },
  { id: 2, title: "Promo Video 30s", image: "/placeholder.svg", description: "Video giới thiệu sản phẩm" },
  { id: 3, title: "Template AE Brand", image: "/placeholder.svg", description: "Template chỉnh sửa theo brand" },
];

const features = [
  { icon: Zap, title: "Motion cơ bản", description: "Logo intro, outro, bumper, text animation" },
  { icon: Tv, title: "Gói Livestream", description: "Lower third, frame, countdown, overlay" },
  { icon: Video, title: "Video quảng cáo", description: "Motion video 10-30s, template AE" },
  { icon: Layers, title: "Chỉnh sửa linh hoạt", description: "Chỉnh màu, text, timing theo yêu cầu" },
];

const deliverables = [
  "File AE project (.aep) source",
  "Video render MP4/MOV 1080p/4K",
  "Bản demo preview trước render",
  "Hướng dẫn chỉnh sửa cơ bản",
  "Font & asset đi kèm",
  "2 lần chỉnh sửa miễn phí",
];

const AfterEffects = () => {
  const [activeTab, setActiveTab] = useState("motion");

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 grid-pattern opacity-5" />
        
        <div className="section-container relative z-10">
          <Link to="/#categories">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Film className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                  After Effects / <span className="gradient-text">Motion Graphics</span>
                </h1>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Motion logo, video quảng cáo, template AE, gói livestream visual – 
              tất cả được thiết kế chuyên nghiệp và dễ dàng tùy chỉnh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 border-y border-border/50">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="py-16">
        <div className="section-container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="motion" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Motion
              </TabsTrigger>
              <TabsTrigger value="livestream" className="gap-2">
                <Tv className="w-4 h-4" />
                Livestream
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <Play className="w-4 h-4" />
                Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="motion">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-bold mb-2">Motion Cơ Bản</h2>
                  <p className="text-muted-foreground">Logo intro, outro, bumper & text animation</p>
                </div>
                <ProductGallery items={motionItems} />
              </motion.div>
            </TabsContent>

            <TabsContent value="livestream">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-bold mb-2">Gói Livestream</h2>
                  <p className="text-muted-foreground">Lower third, frame, countdown & overlay</p>
                </div>
                <ProductGallery items={livestreamItems} />
              </motion.div>
            </TabsContent>

            <TabsContent value="video">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-bold mb-2">Video Quảng Cáo</h2>
                  <p className="text-muted-foreground">Motion video & template AE</p>
                </div>
                <ProductGallery items={videoItems} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 bg-card/50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl font-bold mb-2">Bạn Sẽ Nhận Được</h2>
              <p className="text-muted-foreground">Bàn giao đầy đủ file và hỗ trợ chỉnh sửa</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deliverables.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="section-container">
          <div className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Cần Motion Graphics?
            </h2>
            <p className="text-muted-foreground mb-6">
              Liên hệ ngay để nhận báo giá chi tiết và timeline dự án phù hợp với nhu cầu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="#contact">Nhận báo giá</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:0862098408">Gọi ngay: 0862 098 408</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AfterEffects;
