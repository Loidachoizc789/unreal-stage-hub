import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Save, GripVertical, X } from "lucide-react";

interface PriceItem {
  label: string;
  price: string;
}

interface ServiceGroup {
  id?: string;
  service_name: string;
  items: PriceItem[];
  display_order: number;
}

interface PricingManagerProps {
  categorySlug: string;
  categoryName: string;
  onClose: () => void;
}

const PricingManager = ({ categorySlug, categoryName, onClose }: PricingManagerProps) => {
  const queryClient = useQueryClient();
  const [services, setServices] = useState<ServiceGroup[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [newInclude, setNewInclude] = useState("");
  const [newExclude, setNewExclude] = useState("");

  // Fetch existing pricing data
  const { data: existingPricing, isLoading: pricingLoading } = useQuery({
    queryKey: ["admin-category-pricing", categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_pricing")
        .select("*")
        .eq("category_slug", categorySlug)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: existingNotes, isLoading: notesLoading } = useQuery({
    queryKey: ["admin-category-pricing-notes", categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_pricing_notes")
        .select("*")
        .eq("category_slug", categorySlug)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  useEffect(() => {
    if (existingPricing) {
      setServices(
        existingPricing.map((p) => ({
          id: p.id,
          service_name: p.service_name,
          items: (p.items as unknown as PriceItem[]) || [],
          display_order: p.display_order,
        }))
      );
    }
  }, [existingPricing]);

  useEffect(() => {
    if (existingNotes) {
      setIncludes(existingNotes.includes || []);
      setExcludes(existingNotes.excludes || []);
    }
  }, [existingNotes]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Delete existing pricing for this category
      await supabase
        .from("category_pricing")
        .delete()
        .eq("category_slug", categorySlug);

      // Insert new pricing
      if (services.length > 0) {
        const { error: insertError } = await supabase
          .from("category_pricing")
          .insert(
            services.map((s, index) => ({
              category_slug: categorySlug,
              service_name: s.service_name,
              items: JSON.parse(JSON.stringify(s.items)),
              display_order: index,
            }))
          );
        if (insertError) throw insertError;
      }

      // Upsert notes
      const { error: notesError } = await supabase
        .from("category_pricing_notes")
        .upsert(
          {
            category_slug: categorySlug,
            includes,
            excludes,
          },
          { onConflict: "category_slug" }
        );
      if (notesError) throw notesError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-pricing", categorySlug] });
      queryClient.invalidateQueries({ queryKey: ["category-pricing-notes", categorySlug] });
      queryClient.invalidateQueries({ queryKey: ["admin-category-pricing", categorySlug] });
      queryClient.invalidateQueries({ queryKey: ["admin-category-pricing-notes", categorySlug] });
      toast.success("Đã lưu bảng giá!");
      onClose();
    },
    onError: (error) => {
      toast.error("Lỗi khi lưu: " + error.message);
    },
  });

  const addService = () => {
    setServices([
      ...services,
      {
        service_name: "Nhóm dịch vụ mới",
        items: [{ label: "Dịch vụ", price: "Liên hệ" }],
        display_order: services.length,
      },
    ]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateServiceName = (index: number, name: string) => {
    const updated = [...services];
    updated[index].service_name = name;
    setServices(updated);
  };

  const addPriceItem = (serviceIndex: number) => {
    const updated = [...services];
    updated[serviceIndex].items.push({ label: "Dịch vụ mới", price: "Liên hệ" });
    setServices(updated);
  };

  const removePriceItem = (serviceIndex: number, itemIndex: number) => {
    const updated = [...services];
    updated[serviceIndex].items = updated[serviceIndex].items.filter((_, i) => i !== itemIndex);
    setServices(updated);
  };

  const updatePriceItem = (
    serviceIndex: number,
    itemIndex: number,
    field: "label" | "price",
    value: string
  ) => {
    const updated = [...services];
    updated[serviceIndex].items[itemIndex][field] = value;
    setServices(updated);
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude("");
    }
  };

  const addExclude = () => {
    if (newExclude.trim()) {
      setExcludes([...excludes, newExclude.trim()]);
      setNewExclude("");
    }
  };

  if (pricingLoading || notesLoading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Quản lý bảng giá: {categoryName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Services */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Nhóm dịch vụ</h3>
              <Button onClick={addService} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Thêm nhóm
              </Button>
            </div>

            {services.map((service, serviceIndex) => (
              <Card key={serviceIndex} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={service.service_name}
                      onChange={(e) => updateServiceName(serviceIndex, e.target.value)}
                      className="font-semibold"
                      placeholder="Tên nhóm dịch vụ"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeService(serviceIndex)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updatePriceItem(serviceIndex, itemIndex, "label", e.target.value)
                        }
                        placeholder="Tên dịch vụ"
                        className="flex-1"
                      />
                      <Input
                        value={item.price}
                        onChange={(e) =>
                          updatePriceItem(serviceIndex, itemIndex, "price", e.target.value)
                        }
                        placeholder="Giá"
                        className="w-40"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePriceItem(serviceIndex, itemIndex)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addPriceItem(serviceIndex)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm dịch vụ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Includes */}
          <div className="space-y-3">
            <Label>Bao gồm (hiện màu xanh)</Label>
            <div className="flex flex-wrap gap-2">
              {includes.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {item}
                  <button onClick={() => setIncludes(includes.filter((_, i) => i !== index))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                placeholder="Thêm ghi chú bao gồm..."
                onKeyDown={(e) => e.key === "Enter" && addInclude()}
              />
              <Button onClick={addInclude} size="sm">
                Thêm
              </Button>
            </div>
          </div>

          {/* Excludes */}
          <div className="space-y-3">
            <Label>Không bao gồm (hiện màu xám)</Label>
            <div className="flex flex-wrap gap-2">
              {excludes.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                >
                  {item}
                  <button onClick={() => setExcludes(excludes.filter((_, i) => i !== index))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newExclude}
                onChange={(e) => setNewExclude(e.target.value)}
                placeholder="Thêm ghi chú không bao gồm..."
                onKeyDown={(e) => e.key === "Enter" && addExclude()}
              />
              <Button onClick={addExclude} size="sm">
                Thêm
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Đang lưu..." : "Lưu bảng giá"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingManager;
