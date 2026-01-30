import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function usePosts() {
  return useQuery({
    queryKey: [api.posts.list.path],
    queryFn: async () => {
      const res = await fetch(api.posts.list.path);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return api.posts.list.responses[200].parse(await res.json());
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.posts.like.path, { id });
      const res = await fetch(url, { method: api.posts.like.method });
      if (!res.ok) throw new Error("Failed to like post");
      return api.posts.like.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
    },
  });
}

export function useInteractions() {
  return useQuery({
    queryKey: [api.interactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.interactions.list.path);
      if (!res.ok) throw new Error("Failed to fetch interactions");
      return api.interactions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInteraction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { type: string; content: any }) => {
      const validated = api.interactions.create.input.parse(data);
      const res = await fetch(api.interactions.create.path, {
        method: api.interactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.interactions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit");
      }
      return api.interactions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interactions.list.path] });
      toast({
        title: "Sent with love! 💖",
        description: "Your interaction has been recorded.",
        className: "bg-pink-50 border-pink-200 text-pink-800",
      });
    },
    onError: (err) => {
      toast({
        title: "Oops!",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
