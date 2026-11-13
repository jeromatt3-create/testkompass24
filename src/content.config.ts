import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  rank: z.number(),
  name: z.string(),
  badge: z.string(),
  rating: z.number().min(1).max(5),
  priceRange: z.string(),
  searchQuery: z.string(),
  asin: z.string().optional().default(''),
  highlight: z.string(),
  specs: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    heroImage: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    readingTime: z.number().optional().default(7),
    products: z.array(productSchema).default([]),
    faqs: z.array(faqSchema).default([]),
  }),
});

export const collections = { articles };
