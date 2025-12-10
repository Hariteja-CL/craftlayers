/// <reference types="vite/client" />
import { BlogPost } from "@/data/blog-content";

// Re-export type if needed, or define here. 
// We will reuse the type from data/blog-content for now to avoid breaking changes, 
// but we will implement the logic to fetch real files.

/*
 * Simple Frontmatter Parser for Vite (Browser-compatible)
 * This avoids needing 'fs', 'path', or 'process' polyfills required by 'gray-matter'.
 */
function parseFrontmatter(fileContent: string) {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent);

    if (!match) {
        return {
            data: {},
            content: fileContent
        };
    }

    const frontmatterBlock = match[1];
    const content = fileContent.replace(match[0], "").trim();

    const data: Record<string, any> = {};

    frontmatterBlock.split("\n").forEach(line => {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts.length > 0) {
            let value = valueParts.join(":").trim();
            // Handle basic types strings, arrays
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith('[') && value.endsWith(']')) {
                // Simple array parse: ["a", "b"] -> [a, b]
                value = value.slice(1, -1).split(",").map(v => v.trim().replace(/"/g, '')) as any;
            }
            data[key.trim()] = value;
        }
    });

    return { data, content };
}

function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
}

export function getAllPosts(): BlogPost[] {
    // Vite glob import for raw content
    const modules = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default', eager: true });

    const posts: BlogPost[] = [];

    for (const path in modules) {
        const fileContent = modules[path] as string;
        const { data, content } = parseFrontmatter(fileContent);

        // Derive slug from filename
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        if (!slug) continue;

        posts.push({
            id: slug, // Use slug as ID
            slug: slug,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || '',
            date: data.date || new Date().toDateString(),
            readTime: calculateReadTime(content),
            tags: Array.isArray(data.tags) ? data.tags : [],
            content: content,
            coverImage: data.coverImage
        });
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    const posts = getAllPosts(); // Since eager loaded, this is cheap
    return posts.find(post => post.slug === slug);
}
