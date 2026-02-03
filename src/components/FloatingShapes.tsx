import { motion } from "framer-motion";

const shapes = [
  // Left side shapes
  { id: 1, x: "5%", y: "15%", size: "w-24 h-32", delay: 0 },
  { id: 2, x: "8%", y: "45%", size: "w-20 h-28", delay: 0.5 },
  { id: 3, x: "12%", y: "70%", size: "w-16 h-24", delay: 1 },
  // Right side shapes
  { id: 4, x: "85%", y: "20%", size: "w-20 h-28", delay: 0.3 },
  { id: 5, x: "88%", y: "50%", size: "w-24 h-32", delay: 0.8 },
  { id: 6, x: "82%", y: "75%", size: "w-16 h-24", delay: 1.2 },
];

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: shape.delay },
            scale: { duration: 0.8, delay: shape.delay },
            y: {
              duration: 4 + shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            left: shape.x,
            top: shape.y,
          }}
          className={`absolute ${shape.size}`}
        >
          <div 
            className="w-full h-full rounded-2xl backdrop-blur-sm border border-primary/20"
            style={{
              background: `linear-gradient(135deg, 
                hsl(var(--primary) / 0.15) 0%, 
                hsl(var(--glow-secondary) / 0.1) 100%)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes;
