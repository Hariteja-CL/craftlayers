export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    tags: string[];
    content: string; // Markdown content
    slug: string;
    coverImage?: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        title: "The State of Design 2025",
        excerpt: "Exploring the convergence of AI, Security, and UX in the new era of digital products.",
        date: "Dec 09, 2025",
        readTime: "5 min read",
        tags: ["Design", "AI", "Trends"],
        slug: "state-of-design-2025",
        content: `
# The Convergence

Design is no longer just about aesthetics. It's about **trust**. In an era where AI generates content at scale, the human touch in design becomes a signal of authenticity.

## The Role of Security

When we design for security, we are designing for peace of mind.

\`\`\`tsx
interface TrustProps {
  secure: boolean;
  verified: boolean;
}

const DesignSystem = ({ secure, verified }: TrustProps) => {
  if (!secure) return <AccessDenied />;
  return <SeamlessExperience verified={verified} />;
};
\`\`\`

## Glassmorphism in 2025

The trend has evolved. It's no longer just about the blur; it's about the depth and the light interaction that mimics new hardware materials.
        `,
    },
    {
        id: "2",
        title: "Building Secure Interfaces",
        excerpt: "How to implement trust signals in your UI components without compromising aesthetics.",
        date: "Dec 08, 2025",
        readTime: "8 min read",
        tags: ["Security", "UX", "React"],
        slug: "building-secure-interfaces",
        content: `
# Trust Signals

Users need to feel safe before they engage.

## Key Principles

1. **Transparency**: Tell the user what is happening.
2. **Control**: Give the user the ability to opt-out.
3. **Clarity**: Avoid jargon.

> "Security is not a feature, it's a feeling."

## Implementation

Using the standard Design System tokens ensures consistency.

\`\`\`css
.card-secure {
  border: 1px solid var(--border-success);
  background: var(--surface-subtle);
}
\`\`\`
        `,
    },
];
