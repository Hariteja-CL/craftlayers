import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getPostBySlug } from "@/lib/blog";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
    const { slug } = useParams();
    const post = getPostBySlug(slug || "");

    if (!post) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-h2 font-bold mb-4">Post not found</h2>
                <Link to="/blog" className="text-primary-500 hover:underline">Return to Blog</Link>
            </div>
        );
    }

    return (
        <article className="container mx-auto px-6 py-24 max-w-4xl">
            <Link
                to="/blog"
                className="inline-flex items-center text-content-secondary hover:text-primary-500 mb-xl transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
            </Link>

            <header className="mb-16">
                <div className="flex gap-sm mb-md">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-sm py-2xs bg-surface-subtle text-xs font-medium rounded-full text-content-secondary border border-border-default"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-h1 font-bold text-content-primary mb-lg leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center gap-md text-content-tertiary">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>
            </header>

            <div className="prose prose-lg prose-headings:text-content-primary prose-p:text-content-secondary prose-strong:text-content-primary prose-a:text-primary-500 max-w-none">
                <ReactMarkdown
                    components={{
                        code(props) {
                            const { children, className, node, ref, ...rest } = props;
                            const match = /language-(\w+)/.exec(className || "");
                            return match ? (
                                <SyntaxHighlighter
                                    {...rest}
                                    PreTag="div"
                                    children={String(children).replace(/\n$/, "")}
                                    language={match[1]}
                                    style={vscDarkPlus}
                                    customStyle={{
                                        borderRadius: "12px",
                                        margin: "24px 0",
                                        background: "#1e1e1e", // Ensure dark background matches aesthetics
                                        border: "1px solid var(--border-muted)",
                                    }}
                                />
                            ) : (
                                <code
                                    {...rest}
                                    className="bg-surface-subtle px-1.5 py-0.5 rounded text-primary-500 font-mono text-sm border border-border-muted"
                                >
                                    {children}
                                </code>
                            );
                        },
                        p({ children }) {
                            return <p className="mb-8 leading-relaxed text-content-secondary last:mb-0">{children}</p>;
                        },
                        h1({ children }) { 
                            return <h1 className="text-4xl font-bold mt-16 mb-8 text-content-primary">{children}</h1>;
                        },
                        h2({ children }) {
                            return <h2 className="text-3xl font-bold mt-12 mb-6 text-content-primary">{children}</h2>;
                        },
                        h3({ children }) {
                            return <h3 className="text-2xl font-bold mt-10 mb-5 text-content-primary">{children}</h3>;
                        },
                        h4({ children }) {
                            return <h4 className="text-xl font-bold mt-8 mb-4 text-content-primary">{children}</h4>;
                        },
                        ul({ children }) {
                            return <ul className="list-disc pl-6 mb-8 space-y-2 text-content-secondary">{children}</ul>;
                        },
                        li({ children }) {
                            return <li className="pl-2">{children}</li>;
                        },
                        hr() {
                            return <hr className="my-12 border-border-muted" />;
                        }
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
