// Fallback pricing data for all categories
// Used when database is empty and in PricingManager for initial data

export interface PriceItem {
  label: string;
  price: string;
}

export interface ServiceGroup {
  name: string;
  items: PriceItem[];
}

export interface FallbackPricingData {
  services: ServiceGroup[];
  includes?: string[];
  excludes?: string[];
}

export const fallbackPricingByCategory: Record<string, FallbackPricingData> = {
  "phim-truong-3d": {
    services: [
      {
        name: "Set đơn giản",
        items: [
          { label: "Tin tức / Thời sự", price: "5 – 10 triệu" },
          { label: "Talkshow 1–2 ghế", price: "8 – 15 triệu" },
        ],
      },
      {
        name: "Set trung bình",
        items: [
          { label: "Gameshow nhỏ", price: "15 – 25 triệu" },
          { label: "Event / Sự kiện nhỏ", price: "15 – 30 triệu" },
        ],
      },
      {
        name: "Set phức tạp",
        items: [
          { label: "Livestream lớn", price: "30 – 50 triệu" },
          { label: "Sân khấu sự kiện lớn", price: "50 – 100 triệu+" },
        ],
      },
    ],
    includes: ["Thiết kế 3D hoàn chỉnh", "Bản vẽ thi công", "Hỗ trợ chỉnh sửa 2 lần"],
    excludes: ["Thi công thực tế", "Thiết bị ánh sáng"],
  },
  "thiet-ke-2d": {
    services: [
      {
        name: "Poster / Banner",
        items: [
          { label: "Basic (1 size)", price: "500k – 1 triệu" },
          { label: "Standard (2-3 sizes)", price: "1 – 2 triệu" },
          { label: "Pro (Full set)", price: "2 – 4 triệu" },
        ],
      },
      {
        name: "Bộ nhận diện",
        items: [
          { label: "Logo", price: "2 – 5 triệu" },
          { label: "Bộ Brand Kit", price: "5 – 15 triệu" },
        ],
      },
      {
        name: "Ấn phẩm khác",
        items: [
          { label: "Backdrop sự kiện", price: "1 – 3 triệu" },
          { label: "Catalogue / Brochure", price: "3 – 8 triệu" },
        ],
      },
    ],
    includes: ["File gốc AI/PSD", "Xuất các định dạng", "2 lần chỉnh sửa"],
    excludes: ["In ấn", "Mockup 3D"],
  },
  "model-3d": {
    services: [
      {
        name: "Model đơn giản",
        items: [
          { label: "Đồ vật nhỏ", price: "500k – 1 triệu" },
          { label: "Nội thất cơ bản", price: "1 – 2 triệu" },
        ],
      },
      {
        name: "Model trung bình",
        items: [
          { label: "Nhân vật đơn giản", price: "2 – 5 triệu" },
          { label: "Phương tiện", price: "3 – 8 triệu" },
        ],
      },
      {
        name: "Model phức tạp",
        items: [
          { label: "Nhân vật chi tiết", price: "8 – 20 triệu" },
          { label: "Môi trường / Scene", price: "10 – 30 triệu" },
        ],
      },
    ],
    includes: ["File 3D gốc", "Texture maps", "2 lần chỉnh sửa"],
    excludes: ["Rigging", "Animation"],
  },
  "noi-ngoai-that": {
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
    includes: ["Render 4K", "File PSD layer", "2 lần chỉnh sửa"],
    excludes: ["File 3D gốc", "VR Tour"],
  },
  "after-effects": {
    services: [
      {
        name: "Motion Graphics",
        items: [
          { label: "Intro/Outro (5-10s)", price: "1 – 3 triệu" },
          { label: "Lower Third pack", price: "2 – 4 triệu" },
          { label: "Full package", price: "5 – 10 triệu" },
        ],
      },
      {
        name: "Video Editing",
        items: [
          { label: "Video ngắn (< 1 phút)", price: "1 – 2 triệu" },
          { label: "Video 2-5 phút", price: "3 – 6 triệu" },
          { label: "Video dài (> 5 phút)", price: "6 – 15 triệu" },
        ],
      },
      {
        name: "VFX / Compositing",
        items: [
          { label: "Green screen cơ bản", price: "1 – 3 triệu" },
          { label: "VFX phức tạp", price: "5 – 20 triệu" },
        ],
      },
    ],
    includes: ["File project AE", "Xuất MP4/MOV", "2 lần chỉnh sửa"],
    excludes: ["Footage gốc", "Nhạc bản quyền"],
  },
};

export const getFallbackPricing = (categorySlug: string): FallbackPricingData | null => {
  return fallbackPricingByCategory[categorySlug] || null;
};
