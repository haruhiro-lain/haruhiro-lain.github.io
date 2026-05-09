import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 1. 定义一个通用的文章校验规则 (Schema)
// 这样你所有的文件夹都可以共用这套标准（标题、描述、日期、封面图）
const baseSchema = ({ image }: { image: any }) => 
    z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.optional(image()),
        // 额外加个标签，以后做分类筛选会很方便
        tags: z.array(z.string()).optional().default([]),
    });

// 2. 导出所有集合
export const collections = {
    'learning': defineCollection({
        loader: glob({ base: './src/content/learning', pattern: '**/*.{md,mdx}' }),
        schema: baseSchema,
    }),

    'life': defineCollection({
        loader: glob({ base: './src/content/life', pattern: '**/*.{md,mdx}' }),
        schema: baseSchema,
    }),
};