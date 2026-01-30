import { useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function ConfettiButton() {
  const [isExploding, setIsExploding] = useState(false);

  const handleClick = () => {
    setIsExploding(true);
    
    // Heart shaped confetti
    const heartDefaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['heart'],
      colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#C71585']
    };

    confetti({
      ...heartDefaults,
      particleCount: 50,
      scalar: 2,
    });

    confetti({
      ...heartDefaults,
      particleCount: 25,
      scalar: 3,
      shapes: ['circle'],
    });
    
    setTimeout(() => setIsExploding(false), 1000);
  };

  return (
    <Button 
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl py-6 text-lg font-display"
      disabled={isExploding}
    >
      <Sparkles className="mr-2 w-5 h-5 animate-spin-slow" />
      Panic Button! (Instant Joy)
    </Button>
  );
}
