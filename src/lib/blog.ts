import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export async function getAllPosts() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getFeaturedPosts() {
	const posts = await getAllPosts();
	return posts.filter((post) => post.data.featured);
}

export async function getCategories() {
	const posts = await getAllPosts();
	const map = new Map<string, BlogEntry[]>();

	for (const post of posts) {
		const category = post.data.category || 'General';
		const group = map.get(category) ?? [];
		group.push(post);
		map.set(category, group);
	}

	return Array.from(map.entries())
		.map(([name, posts]) => ({ name, posts, count: posts.length }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export async function getTags() {
	const posts = await getAllPosts();
	const map = new Map<string, BlogEntry[]>();

	for (const post of posts) {
		for (const tag of post.data.tags || []) {
			const group = map.get(tag) ?? [];
			group.push(post);
			map.set(tag, group);
		}
	}

	return Array.from(map.entries())
		.map(([name, posts]) => ({ name, posts, count: posts.length }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}
