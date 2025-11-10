import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.get(`/users/${userId}`),
    enabled: !!userId,
  });
}

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts"),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: { title: string; content: string }) =>
      api.post("/posts", newPost),
    onSuccess: () => {
      // Invalidate and refetch posts query
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title: string; content: string };
    }) => api.put(`/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
