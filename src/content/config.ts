import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.number().int().min(2000).max(2100),
    status: z.enum(["active", "maintained", "archived"]).default("active"),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    externalUrl: z.string().url().optional(),
    order: z.number().int().optional(),
  }),
});

export const collections = {
  projects,
};
