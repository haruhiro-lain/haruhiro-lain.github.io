/**
 * 内容集合查询工具
 *
 * 提供统一的文章获取、排序、过滤、分组和静态路径生成函数。
 * 所有函数泛型约束在 ContentCollection（'learning' | 'life'）上。
 */
import { getCollection, type CollectionEntry } from 'astro:content';

// ============================================================
// 常量 & 类型
// ============================================================

/** 所有内容集合的名称 */
export const CONTENT_COLLECTIONS = ['learning', 'life'] as const;

/** 内容集合的联合类型 */
export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

// ============================================================
// 基础查询：获取 & 排序
// ============================================================

/**
 * 获取指定集合中按发布日期倒序排列的所有文章
 * @param collection - 集合名称（'learning' | 'life'）
 * @returns 按 pubDate 降序排列的文章列表
 */
export async function getSortedPosts<C extends ContentCollection>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const posts = await getCollection(collection);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// ============================================================
// 过滤：按子目录分段
// ============================================================

/**
 * 获取指定集合下某个子目录的所有文章（按发布日期倒序）
 * @param collection - 集合名称
 * @param section  - 子目录名（如 'algorithms'、'weekly'）
 * @returns 该子目录下的文章列表
 */
export async function getSectionPosts<C extends ContentCollection>(
  collection: C,
  section: string,
): Promise<CollectionEntry<C>[]> {
  const sectionPrefix = `${section}/`;
  const posts = await getSortedPosts(collection);
  return posts.filter((post) => post.id.startsWith(sectionPrefix));
}

// ============================================================
// 分组：按子目录聚合
// ============================================================

/**
 * 将指定集合的文章按给定的子目录列表分组
 * @param collection - 集合名称
 * @param sections   - 子目录名列表（决定分组顺序）
 * @returns 每组包含 section 名称及其对应文章列表
 */
export async function getGroupedSectionPosts<C extends ContentCollection, S extends string>(
  collection: C,
  sections: readonly S[],
) {
  const posts = await getSortedPosts(collection);
  return sections.map((section) => ({
    section,
    posts: posts.filter((post) => post.id.startsWith(`${section}/`)),
  }));
}

/**
 * 将指定集合的文章按第一级路径段自动分组
 * @param collection     - 集合名称
 * @param preferredOrder - 期望的分组顺序（按此顺序排列，其余追加）
 * @param routeSegments  - 路径段到路由名称的映射（如 { gk: 'GK' }）
 * @returns 每组包含原始 section、routeSegment 及带 canonicalId 的文章列表
 */
export async function getGroupedPostsByFirstSegment<C extends ContentCollection>(
  collection: C,
  preferredOrder: readonly string[],
  routeSegments: Record<string, string> = {},
) {
  const posts = await getSortedPosts(collection);

  // 按第一级路径段（section）聚合
  const groupedPosts = posts.reduce(
    (result, post) => {
      const section = (post.id.split('/')[0] || '').toLowerCase();
      if (!result[section]) {
        result[section] = [];
      }
      result[section].push(post);
      return result;
    },
    {} as Record<string, CollectionEntry<C>[]>,
  );

  // 按 preferredOrder 排列，其余 section 追加在末尾
  const orderedSections = Array.from(
    new Set([...preferredOrder.map((s) => s.toLowerCase()), ...Object.keys(groupedPosts)]),
  );

  return orderedSections.map((section) => ({
    section,
    routeSegment: routeSegments[section] || section,
    posts: (groupedPosts[section] || []).map((post) => ({
      post,
      canonicalId: getCanonicalPostId(post.id, routeSegments),
    })),
  }));
}

// ============================================================
// 辅助：canonical ID 转换 & 截取
// ============================================================

/**
 * 将文章原始 ID 转换为规范化的路由路径
 *
 * 例如 post.id = "gk/喷笔选购" + routeSegments = { gk: 'GK' }
 *   → 返回 "GK/喷笔选购"
 *
 * @param postId        - 文章原始 ID（如 "projects/my-app"）
 * @param routeSegments - 路径段映射表（小写 key → 展示用 value）
 * @returns 规范化后的路径
 */
export function getCanonicalPostId(
  postId: string,
  routeSegments: Record<string, string> = {},
) {
  const [section = '', ...restParts] = postId.split('/');
  const normalizedSection = section.toLowerCase();
  const canonicalSection = routeSegments[normalizedSection] || section;
  if (restParts.length === 0) {
    return canonicalSection;
  }
  return `${canonicalSection}/${restParts.join('/')}`;
}

/**
 * 获取指定集合最近 N 篇文章，附带规范化路径
 * @param collection     - 集合名称
 * @param limit          - 文章数量上限
 * @param routeSegments  - 路径段映射表
 * @returns 文章对象 + canonicalId 的数组
 */
export async function getRecentPostsWithCanonical<C extends ContentCollection>(
  collection: C,
  limit: number,
  routeSegments: Record<string, string> = {},
) {
  const posts = await getSortedPosts(collection);
  return posts.slice(0, limit).map((post) => ({
    post,
    canonicalId: getCanonicalPostId(post.id, routeSegments),
  }));
}

// ============================================================
// 静态路径生成（供 getStaticPaths 使用）
// ============================================================

/**
 * 为整个集合生成静态路径（slug  = 文章完整 ID）
 * 用于 [...slug].astro 页面
 */
export async function getCollectionStaticPaths<C extends ContentCollection>(collection: C) {
  const posts = await getCollection(collection);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

/**
 * 为指定子目录生成静态路径（slug = 子目录后的路径段）
 * 用于 [section]/[...slug].astro 页面
 */
export async function getSectionStaticPaths<C extends ContentCollection>(
  collection: C,
  section: string,
) {
  const sectionPosts = await getSectionPosts(collection, section);
  const sectionPrefixLength = section.length + 1; // '+1' 去掉 '/' 前缀
  return sectionPosts.map((post) => ({
    params: { slug: post.id.slice(sectionPrefixLength) },
    props: post,
  }));
}