import { motion } from "framer-motion";
import {
  Heart,
  Stars,
  Gift,
  Calendar,
  MessageCircle,
  Music,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePosts, useCreateInteraction } from "@/hooks/use-content";
import { BlogPost } from "@/components/BlogPost";
import { ConfettiButton } from "@/components/ConfettiButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Form Components within Home for simplicity of this specific layout
const LoveNoteForm = () => {
  const { mutate, isPending } = useCreateInteraction();
  const formSchema = z.object({ message: z.string().min(1) });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) =>
        mutate({ type: "message", content: data }),
      )}
      className="space-y-4"
    >
      <Textarea
        placeholder="Write something sweet..."
        className="min-h-[120px] rounded-xl border-pink-100 focus:border-pink-300 focus:ring-pink-100 bg-pink-50/30"
        {...form.register("message")}
      />
      <Button
        disabled={isPending}
        type="submit"
        className="w-full rounded-xl bg-pink-400 hover:bg-pink-500 text-white"
      >
        {isPending ? "Sending..." : "Send Love Note 💌"}
      </Button>
    </form>
  );
};

const DateIdeaForm = () => {
  const { mutate, isPending } = useCreateInteraction();
  const [category, setCategory] = useState("dinner");
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;
    mutate({ type: "date_idea", content: { category, idea } });
    setIdea("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="rounded-xl border-pink-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dinner">Dinner Date 🍝</SelectItem>
            <SelectItem value="adventure">Adventure 🎢</SelectItem>
            <SelectItem value="cozy">Cozy Night In 🎬</SelectItem>
            <SelectItem value="outdoor">Outdoor Fun 🌳</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Your Idea</Label>
        <Input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. Picnic at the park..."
          className="rounded-xl border-pink-100"
        />
      </div>
      <Button
        disabled={isPending}
        type="submit"
        className="w-full rounded-xl bg-rose-400 hover:bg-rose-500 text-white"
      >
        Submit Idea 💡
      </Button>
    </form>
  );
};

const MoodCheckForm = () => {
  const { mutate } = useCreateInteraction();

  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { mood: "happy", emoji: "🥰" },
        { mood: "excited", emoji: "🤩" },
        { mood: "tired", emoji: "😴" },
        { mood: "sad", emoji: "🥺" },
      ].map((item) => (
        <motion.button
          key={item.mood}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => mutate({ type: "mood", content: { mood: item.mood } })}
          className="aspect-square flex items-center justify-center text-3xl bg-white rounded-xl shadow-sm border border-pink-100 hover:bg-pink-50 transition-colors"
        >
          {item.emoji}
        </motion.button>
      ))}
    </div>
  );
};

// Fake calculator logic just for fun UI
import { useState } from "react";

const LoveCalculator = () => {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = () => {
    setLoading(true);
    setScore(null);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 20) + 80); // Always high score ;)
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 text-center">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="You"
          className="rounded-xl text-center border-pink-100"
        />
        <Heart className="text-pink-400 animate-pulse fill-pink-200" />
        <Input
          placeholder="Crush"
          className="rounded-xl text-center border-pink-100"
        />
      </div>

      <Button
        onClick={calculate}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white"
      >
        {loading ? "Calculating..." : "Calculate Compatability 💘"}
      </Button>

      {score !== null && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-4 bg-pink-50 rounded-xl border border-pink-200"
        >
          <div className="text-4xl font-display text-pink-600 mb-1">
            {score}%
          </div>
          <div className="text-sm text-pink-400">Perfect Match!</div>
        </motion.div>
      )}
    </div>
  );
};

export default function Home() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="flex flex-col items-center gap-4">
          <Heart className="w-12 h-12 text-pink-400 animate-bounce fill-pink-200" />
          <p className="font-display text-xl text-pink-400">
            Loading our love story...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F5] selection:bg-pink-200">
      {/* Hero Section */}
      <header className="py-12 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="inline-block p-4 rounded-full bg-white/50 backdrop-blur-sm mb-6 shadow-xl shadow-pink-100 ring-4 ring-white/30">
            <Stars className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-2xl md:text-4xl mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 drop-shadow-sm pb-2">
            Surat Cinta untuk Wanita Impianku, Lily
          </h1>
          <p className="text-xl text-gray-500 font-body max-w-2xl mx-auto">
            A digital garden of our favorite memories, moments, and dreams.
          </p>
        </motion.div>
      </header>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Blog Feed (60%) */}
          <main className="w-full lg:w-[60%] space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-display text-gray-700">
                Memory Lane
              </h2>
            </div>

            {posts && posts.length > 0 ? (
              posts.map((post, i) => (
                <BlogPost key={post.id} post={post} index={i} />
              ))
            ) : (
              <Card className="border-dashed border-2 border-pink-200 bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-12 h-12 text-pink-200 mb-4" />
                  <p className="text-gray-400 font-display text-xl">
                    No memories yet...
                  </p>
                  <p className="text-gray-400 text-sm">
                    But our future is bright! ✨
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="text-center pt-8 pb-12">
              <span className="inline-block w-24 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent rounded-full" />
              <p className="mt-4 text-gray-400 font-display text-lg">
                To be continued...
              </p>
            </div>
          </main>

          {/* Right Column: Interactive Zone (40%) */}
          <aside className="w-full lg:w-[40%]">
            <div className="sticky top-8 space-y-8">
              {/* Interactive Card */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-pink-100/60 border border-pink-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300" />

                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-6 h-6 text-rose-400" />
                  <h2 className="text-2xl font-display text-gray-700">
                    Fun Zone
                  </h2>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue="note"
                >
                  <AccordionItem value="note" className="border-pink-100">
                    <AccordionTrigger className="font-display text-lg hover:text-pink-500 hover:no-underline px-2">
                      <span className="flex items-center gap-2">
                        💌 Send a Love Note
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 pt-4">
                      <LoveNoteForm />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="date" className="border-pink-100">
                    <AccordionTrigger className="font-display text-lg hover:text-pink-500 hover:no-underline px-2">
                      <span className="flex items-center gap-2">
                        🌹 Date Ideas
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 pt-4">
                      <DateIdeaForm />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="calc" className="border-pink-100">
                    <AccordionTrigger className="font-display text-lg hover:text-pink-500 hover:no-underline px-2">
                      <span className="flex items-center gap-2">
                        🔢 Love Calculator
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 pt-4">
                      <LoveCalculator />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mood" className="border-pink-100">
                    <AccordionTrigger className="font-display text-lg hover:text-pink-500 hover:no-underline px-2">
                      <span className="flex items-center gap-2">
                        🌈 Mood Check
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 pt-4">
                      <MoodCheckForm />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Panic Button */}
              <ConfettiButton />

              {/* Footer Decoration */}
              <div className="flex justify-center gap-4 text-pink-200">
                <Heart className="w-4 h-4" />
                <Stars className="w-4 h-4" />
                <Zap className="w-4 h-4" />
                <Music className="w-4 h-4" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
