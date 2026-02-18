import { defineCollection, z } from 'astro:content';

const sourceSchema = z.object({
  type: z.enum(['regulation', 'industry-report', 'academic', 'news', 'official-report', 'data', 'case-study']),
  title: z.string(),
  author: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional(),
  note: z.string().optional(),
});

const quickWins = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    time: z.number(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    insuranceSector: z.string(),
    aiTool: z.string(),
    prompt: z.string(),
    tips: z.array(z.string()).optional(),
    cautions: z.array(z.string()).optional(),
    sources: z.array(sourceSchema).optional(),
    order: z.number().optional(),
  }),
});

const whatNotToDo = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    number: z.number(),
    description: z.string(),
    risk: z.string(),
    realExample: z.string(),
    mitigation: z.string(),
    insureversiasTake: z.string().optional(),
    sources: z.array(sourceSchema).optional(),
  }),
});

const whatToDo = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    number: z.number(),
    description: z.string(),
    howTo: z.string(),
    steps: z.array(z.string()),
    tools: z.array(z.string()).optional(),
    sources: z.array(sourceSchema).optional(),
  }),
});

const faq = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['skeptical', 'curious', 'using', 'leading', 'deciding']),
    order: z.number().optional(),
    sources: z.array(sourceSchema).optional(),
  }),
});

const successStories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    insuranceSector: z.string(),
    category: z.enum(['efficiency', 'quality', 'innovation', 'access', 'regulatory']),
    keyMetric: z.string(),
    description: z.string(),
    challenge: z.string(),
    approach: z.string(),
    results: z.string(),
    lessons: z.string(),
    sources: z.array(sourceSchema).optional(),
    order: z.number().optional(),
  }),
});

const insuranceChallenges = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    number: z.number(),
    description: z.string(),
    date: z.string(),
    perspectives: z.object({
      regulatory: z.string(),
      ethical: z.string(),
      financial: z.string(),
      social: z.string(),
      technological: z.string().optional(),
    }),
    insureversiasTake: z.string(),
    relatedRegulations: z.array(z.string()).optional(),
    sources: z.array(sourceSchema).optional(),
    order: z.number().optional(),
  }),
});

const regulations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    jurisdiction: z.string(),
    date: z.string(),
    status: z.enum(['enacted', 'in-progress']),
    scope: z.string(),
    description: z.string(),
    impactInsurance: z.string(),
    impactBusiness: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    insureversiasTake: z.string().optional(),
    sources: z.array(sourceSchema).optional(),
    order: z.number().optional(),
  }),
});

export const collections = {
  'quick-wins': quickWins,
  'what-not-to-do': whatNotToDo,
  'what-to-do': whatToDo,
  'faq': faq,
  'success-stories': successStories,
  'insurance-challenges': insuranceChallenges,
  'regulations': regulations,
};
