import { motion } from "framer-motion";
import { format } from "date-fns";
import { Post } from "@shared/schema";
import { HeartButton } from "./HeartButton";
import { useLikePost } from "@/hooks/use-content";

interface BlogPostProps {
  post: Post;
  index: number;
}

export function BlogPost({ post, index }: BlogPostProps) {
  const { mutate: likePost } = useLikePost();

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-[2rem] p-6 mb-8 shadow-xl shadow-pink-100/50 border-2 border-pink-50 hover:border-pink-100 transition-colors relative overflow-hidden group"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-bl-[100%] -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />

      {post.imageUrl && (
        <div className="mb-6 rounded-xl overflow-hidden shadow-inner aspect-video">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold tracking-wider uppercase mb-2">
              Memory
            </span>
            <h3 className="text-2xl md:text-3xl text-gray-800 font-display mb-1">{post.title}</h3>
            <time className="text-sm text-gray-400 font-medium italic">
              {post.createdAt ? format(new Date(post.createdAt), 'MMMM do, yyyy') : 'Just now'}
            </time>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6 font-body text-lg">
          {post.content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-pink-50">
          <HeartButton likes={post.likes || 0} onClick={() => likePost(post.id)} />
          <span className="text-xs text-pink-300 font-display">With love xoxo</span>
        </div>
      </div>
    </motion.article>
  );
}
