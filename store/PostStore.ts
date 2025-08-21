import { create } from "zustand";

export interface Post {
  caption?: string;
  images: string[];
  permalink: string;
  timestamp?: string;
  page_name?: string;
  page_logo?: string;
}

interface PostState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  getPostByPermalink: (permalink: string) => Post | undefined;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  getPostByPermalink: (permalink: string) =>
    get().posts.find((p) => p.permalink === permalink),
}));
