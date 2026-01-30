import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  likes: number;
  onClick: () => void;
  className?: string;
}

export function HeartButton({ likes, onClick, className }: HeartButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [hearts, setHearts] = useState<{ id: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(true);
    onClick();
    
    // Create floating hearts
    const newHeart = { id: Date.now() };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  return (
    <div className="relative inline-block">
      <motion.button
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        onClick={handleClick}
        className={cn(
          "group flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
          isLiked ? "bg-red-50 text-red-500" : "bg-white/50 text-gray-500 hover:text-red-400 hover:bg-white",
          className
        )}
      >
        <Heart className={cn("w-5 h-5 transition-all", isLiked && "fill-current text-red-500")} />
        <span className="font-semibold text-sm">{likes}</span>
      </motion.button>

      {/* Floating Hearts Animation */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -40, x: Math.random() * 20 - 10, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 left-1/2 pointer-events-none text-red-500"
          >
            <Heart className="w-4 h-4 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
