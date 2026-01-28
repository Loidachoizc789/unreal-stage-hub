import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, Video, Palette, Box, Home, Film, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const pricingCategories = [
  {
    id: "3d-studios",
    icon: Video,
    title: "Phim Trường 3D / Virtual Production",
    color: "from-blue-500 to-cyan-500",
    services: [
      {
        name: "Scene 3D – Không gian ảo",
        items: [
          { label: "Scene đơn giản (talkshow / livestream)", price: "3 – 5 triệu" },
          { label: "Scene chi tiết (TV show / event nhỏ)", price: "5 – 8 triệu" },
          { label: "Scene phức tạp (nhiều màn LED, ánh sáng)", price: "8 – 15 triệu" },
        ],
      },
      {
        name: "Gói phim trường",
        items: [
          { label: "1 scene + 5–7 ảnh render", price: "5 – 8 triệu" },
          { label: "1 scene + animation camera 10–15s", price: "8 – 12 triệu" },
          { label: "2–3 scene + setup đồng bộ", price: "12 – 20 triệu" },
        ],
      },
    ],
    includes: ["Model + lighting + render"],
    excludes: ["Không bao gồm nhân vật diễn xuất phức tạp"],
  },
  {
    id: "2d-design",
    icon: Palette,
    title: "Thiết Kế 2D",
    color: "from-purple-500 to-pink-500",
    services: [
      {
        name: "Thiết kế đơn lẻ",
        items: [
          { label: "Banner / KV đơn", price: "200k – 500k" },
          { label: "Poster sự kiện", price: "800k – 1.500k" },
          { label: "Backdrop sân khấu", price: "1 – 2 triệu" },
        ],
      },
      {
        name: "Gói 2D",
        items: [
          { label: "Bộ livestream (frame + lower third)", price: "1.5 – 3 triệu" },
          { label: "Bộ sự kiện (KV + banner + backdrop)", price: "3 – 6 triệu" },
          { label: "Hồ sơ trình bày (10–15 trang)", price: "2.5 – 5 triệu" },
        ],
      },
    ],
  },
  {
    id: "3d-models",
    icon: Box,
    title: "Model 3D / Asset",
    color: "from-orange-500 to-amber-500",
    services: [
      {
        name: "Asset đơn",
        items: [
          { label: "Props đơn giản", price: "300k – 700k" },
          { label: "Props chi tiết", price: "800k – 2 triệu" },
          { label: "Asset clean topology (dùng animation)", price: "2 – 4 triệu" },
        ],
      },
      {
        name: "Không gian 3D",
        items: [
          { label: "Phòng / set nhỏ", price: "2 – 4 triệu" },
          { label: "Studio / booth", price: "4 – 8 triệu" },
          { label: "Background modular (nhiều module)", price: "6 – 10 triệu" },
        ],
      },
    ],
    includes: ["Giao file: Blender / FBX / UE"],
  },
  {
    id: "interior-exterior",
    icon: Home,
    title: "Thiết Kế Nội – Ngoại Thất (3D)",
    color: "from-green-500 to-emerald-500",
    services: [
      {
        name: "Nội thất (ảnh tĩnh)",
        items: [
          { label: "1 view", price: "700k – 1.200k" },
          { label: "4 view", price: "3 – 5 triệu" },
          { label: "6 view", price: "5 – 8 triệu" },
        ],
      },
      {
        name: "Ngoại thất",
        items: [
          { label: "Nhà phố", price: "3 – 6 triệu" },
          { label: "Biệt thự nhỏ", price: "6 – 12 triệu" },
          { label: "Phối cảnh dự án nhỏ", price: "12 – 25 triệu" },
        ],
      },
      {
        name: "Animation nội thất",
        items: [
          { label: "10–15s", price: "3 – 6 triệu" },
          { label: "20–30s", price: "6 – 12 triệu" },
        ],
      },
    ],
  },
  {
    id: "after-effects",
    icon: Film,
    title: "After Effects / Motion Graphics",
    color: "from-red-500 to-rose-500",
    services: [
      {
        name: "Motion cơ bản",
        items: [
          { label: "Logo intro 5–7s", price: "500k – 1.200k" },
          { label: "Outro / bumper", price: "400k – 800k" },
          { label: "Text animation đơn", price: "200k – 400k" },
        ],
      },
      {
        name: "Livestream / Video",
        items: [
          { label: "Lower Third (1 mẫu)", price: "300k – 600k" },
          { label: "Gói livestream (frame + lower third + logo)", price: "1.5 – 3 triệu" },
          { label: "Countdown / intro livestream", price: "800k – 1.5 triệu" },
        ],
      },
      {
        name: "Video quảng cáo / social",
        items: [
          { label: "Motion video 10–15s", price: "1.5 – 3 triệu" },
          { label: "Motion video 20–30s", price: "3 – 6 triệu" },
          { label: "Template AE chỉnh sửa theo brand", price: "2 – 4 triệu" },
        ],
      },
      {
        name: "Chỉnh sửa / làm từ file có sẵn",
        items: [
          { label: "Chỉnh màu / text / timing", price: "200k – 400k / lần" },
          { label: "Render lại nhiều version", price: "+10–20%" },
        ],
      },
    ],
  },
];

const generalTerms = [
  { label: "Đặt cọc", value: "30–50%" },
  { label: "Chỉnh sửa miễn phí", value: "2 lần" },
  { label: "Sửa thêm", value: "200k – 400k / lần" },
  { label: "Deadline gấp", value: "+20–30%" },
  { label: "Combo nhiều dịch vụ", value: "Giảm giá" },
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openCategories, setOpenCategories] = useState<string[]>(["3d-studios"]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Bảng Giá <span className="gradient-text">Dịch Vụ</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Giá tham khảo cho từng loại dịch vụ – liên hệ để nhận báo giá chi tiết theo yêu cầu cụ thể.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="space-y-4 mb-12">
          {pricingCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Collapsible
                open={openCategories.includes(category.id)}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-left text-lg md:text-xl">{category.title}</CardTitle>
                      </div>
                      {openCategories.includes(category.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {category.services.map((service) => (
                          <div key={service.name} className="space-y-3">
                            <h4 className="font-semibold text-primary border-b border-border pb-2">
                              {service.name}
                            </h4>
                            <ul className="space-y-2">
                              {service.items.map((item) => (
                                <li key={item.label} className="flex justify-between text-sm gap-2">
                                  <span className="text-muted-foreground">{item.label}</span>
                                  <span className="font-medium text-foreground whitespace-nowrap">{item.price}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      
                      {/* Includes/Excludes */}
                      {(category.includes || category.excludes) && (
                        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4">
                      {category.includes?.map((item) => (
                            <span key={item} className="flex items-center gap-2 text-sm text-primary">
                              <Check className="w-4 h-4" /> {item}
                            </span>
                          ))}
                          {category.excludes?.map((item) => (
                            <span key={item} className="text-sm text-muted-foreground">
                              ❌ {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </div>

        {/* General Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-8"
        >
          <h3 className="font-display text-xl font-bold mb-6 text-center">Quy Định Chung</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {generalTerms.map((term) => (
              <div key={term.label} className="text-center p-4 rounded-lg bg-card/50 border border-border">
                <p className="text-sm text-muted-foreground mb-1">{term.label}</p>
                <p className="font-semibold text-primary">{term.value}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <a href="#contact">
                <MessageCircle className="w-5 h-5" />
                Nhận báo giá chi tiết
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
