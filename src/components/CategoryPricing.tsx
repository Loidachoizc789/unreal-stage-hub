import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceItem {
  label: string;
  price: string;
}

interface ServiceGroup {
  name: string;
  items: PriceItem[];
}

interface CategoryPricingProps {
  services: ServiceGroup[];
  includes?: string[];
  excludes?: string[];
}

const generalTerms = [
  { label: "Đặt cọc", value: "30–50%" },
  { label: "Chỉnh sửa miễn phí", value: "2 lần" },
  { label: "Sửa thêm", value: "200k – 400k / lần" },
  { label: "Deadline gấp", value: "+20–30%" },
];

const CategoryPricing = ({ services, includes, excludes }: CategoryPricingProps) => {
  return (
    <section className="py-16 bg-card/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Bảng Giá <span className="gradient-text">Tham Khảo</span>
          </h2>
          <p className="text-muted-foreground">
            Liên hệ để nhận báo giá chi tiết theo yêu cầu cụ thể của bạn.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.items.map((item) => (
                      <li key={item.label} className="flex justify-between text-sm gap-2 pb-2 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-semibold text-foreground whitespace-nowrap">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Includes/Excludes */}
        {(includes || excludes) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            {includes?.map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-2 rounded-full">
                <Check className="w-4 h-4" /> {item}
              </span>
            ))}
            {excludes?.map((item) => (
              <span key={item} className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                ❌ {item}
              </span>
            ))}
          </motion.div>
        )}

        {/* General Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4 text-center">Quy Định Chung</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {generalTerms.map((term) => (
              <div key={term.label} className="text-center p-3 rounded-lg bg-card/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{term.label}</p>
                <p className="font-semibold text-primary text-sm">{term.value}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
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

export default CategoryPricing;
