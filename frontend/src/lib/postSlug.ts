// src/lib/data/post.ts
import { cache } from "react";
import { fetchPostBySlug } from "@/lib/api";
import type { Post } from "@/types";

export const getPostBySlugCached = cache(async (slug: string): Promise<Post | null> => {
  return fetchPostBySlug(slug);
});
