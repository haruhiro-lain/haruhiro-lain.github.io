import { getCollection, type CollectionEntry } from 'astro:content';

export const CONTENT_COLLECTIONS = [
	'learning',
	'life',
] as const;

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

export async function getSortedPosts<C extends ContentCollection>(
	collection: C,
): Promise<CollectionEntry<C>[]> {
	const posts = await getCollection(collection);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getRecentPosts<C extends ContentCollection>(
	collection: C,
	limit: number,
): Promise<CollectionEntry<C>[]> {
	const posts = await getSortedPosts(collection);
	return posts.slice(0, limit);
}

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

export async function getRecentPostsWithCanonical<C extends ContentCollection>(
	collection: C,
	limit: number,
	routeSegments: Record<string, string> = {},
) {
	const posts = await getRecentPosts(collection, limit);
	return posts.map((post) => ({
		post,
		canonicalId: getCanonicalPostId(post.id, routeSegments),
	}));
}

export async function getCollectionStaticPaths<C extends ContentCollection>(collection: C) {
	const posts = await getCollection(collection);
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}

export async function getSectionPosts<C extends ContentCollection>(
	collection: C,
	section: string,
): Promise<CollectionEntry<C>[]> {
	const sectionPrefix = `${section}/`;
	const posts = await getSortedPosts(collection);
	return posts.filter((post) => post.id.startsWith(sectionPrefix));
}

export async function getRecentSectionPostsWithCanonical<C extends ContentCollection>(
	collection: C,
	section: string,
	limit: number,
	routeSegments: Record<string, string> = {},
) {
	const posts = (await getSectionPosts(collection, section)).slice(0, limit);
	return posts.map((post) => ({
		post,
		canonicalId: getCanonicalPostId(post.id, routeSegments),
	}));
}

export async function getSectionStaticPaths<C extends ContentCollection>(
	collection: C,
	section: string,
) {
	const sectionPosts = await getSectionPosts(collection, section);
	const sectionPrefixLength = section.length + 1;
	return sectionPosts.map((post) => ({
		params: { slug: post.id.slice(sectionPrefixLength) },
		props: post,
	}));
}

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

export async function getGroupedPostsByFirstSegment<C extends ContentCollection>(
	collection: C,
	preferredOrder: readonly string[],
	routeSegments: Record<string, string> = {},
) {
	const posts = await getSortedPosts(collection);
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

	const orderedSections = Array.from(new Set([
		...preferredOrder.map((section) => section.toLowerCase()),
		...Object.keys(groupedPosts),
	]));

	return orderedSections.map((section) => ({
		section,
		routeSegment: routeSegments[section] || section,
		posts: (groupedPosts[section] || []).map((post) => ({
			post,
			canonicalId: getCanonicalPostId(post.id, routeSegments),
		})),
	}));
}