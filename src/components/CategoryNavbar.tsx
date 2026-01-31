import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const categoryLinks = [
  { href: "/phim-truong-3d", label: "Phim Trường 3D" },
  { href: "/thiet-ke-2d", label: "Thiết Kế 2D" },
  { href: "/model-3d", label: "Model 3D" },
  { href: "/noi-ngoai-that", label: "Nội Ngoại Thất" },
  { href: "/after-effects", label: "After Effects" },
];

const CategoryNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass border-b border-glass-border" : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                alt="DesignHomeKey"
                className="h-12 md:h-14 w-auto"
                src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  Trang chủ
                </Button>
              </Link>
              <div className="w-px h-6 bg-border mx-2" />
              {categoryLinks.map((link) => (
                <Link key={link.href} to={link.href}>
                  <Button
                    variant={isActive(link.href) ? "default" : "ghost"}
                    size="sm"
                    className={isActive(link.href) ? "" : "text-muted-foreground hover:text-foreground"}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="hero" size="sm" asChild>
                <a href="tel:0862098408">Liên hệ ngay</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-glass-border lg:hidden"
          >
            <div className="section-container py-4">
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Trang chủ</span>
                </Link>
                
                <div className="border-t border-border my-2" />
                
                {categoryLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-border mt-2">
                  <Button variant="hero" className="w-full" asChild>
                    <a href="tel:0862098408">Liên hệ ngay</a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryNavbar;
