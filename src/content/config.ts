import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      meta: z.string(),
      summary: z.string(),
      summaryShort: z.string().optional(),
      summaryLong: z.string().optional(),
      context: z.string(),
      role: z.string().optional(),
      focus: z.string().optional(),
      highlights: z.array(z.string()).max(4).default([]),
      year: z.number().int().min(2000).max(2100),
      status: z.enum(["active", "maintained", "archived"]).default("active"),
      featured: z.boolean().default(false),
      homeFeatured: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      externalUrl: z.string().url().optional(),
      repoUrl: z.string().url().optional(),
      cover: z
        .object({
          src: image(),
          alt: z.string(),
          caption: z.string().optional(),
        })
        .optional(),
      media: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      order: z.number().int().optional(),
    }),
});

export const collections = {
  projects,
};
