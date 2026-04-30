import { getCollection, type CollectionEntry } from 'astro:content';

export const CONTENT_COLLECTIONS = [
	'blog',
	'algorithms',
	'projects',
	'interview',
	'life',
] as const;

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

export async function getSortedPosts<C extends ContentCollection>(
	collection: C,
): Promise<CollectionEntry<C>[]> {
	const posts = await getCollection(collection);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getCollectionStaticPaths<C extends ContentCollection>(collection: C) {
	const posts = await getCollection(collection);
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}