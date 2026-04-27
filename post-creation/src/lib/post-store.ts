"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PostType =
  | "general"
  | "promote-upload"
  | "live-stream"
  | "other";

export interface PostState {
  title: string;
  postType: PostType;
  liveStreamAt: string | null;
  bodyJson: string | null;
  bodyHtml: string;
  tags: string[];
  teaser: string;
  exclusive: boolean;
  imageUrl: string;
  setField: <K extends keyof PostState>(key: K, value: PostState[K]) => void;
  reset: () => void;
}

const initial: Omit<PostState, "setField" | "reset"> = {
  title: "",
  postType: "general",
  liveStreamAt: null,
  bodyJson: null,
  bodyHtml: "",
  tags: [],
  teaser: "",
  exclusive: false,
  imageUrl: "/post-image.jpg",
};

export const usePostStore = create<PostState>()(
  persist(
    (set) => ({
      ...initial,
      setField: (key, value) => set({ [key]: value } as Partial<PostState>),
      reset: () => set(initial),
    }),
    { name: "mixcloud-post-prototype" }
  )
);
