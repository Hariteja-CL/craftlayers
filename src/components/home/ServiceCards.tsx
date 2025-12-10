import { motion } from "framer-motion";
import { ArrowRight, Palette, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { homeContent } from "@/data/home-content";
import { cn } from "@/lib/utils";

const iconMap = {
    Palette: Palette,
    Sparkles: Sparkles,
    ShieldCheck: ShieldCheck,
};

// Create a motion version of the router Link
const MotionLink = motion(Link);

export function ServiceCards() {
    return (
        <section className="container mx-auto px-6 pb-24 max-w-[1440px]">
            {/* Bento Grid layout: 2 columns on tablet, 3 on desktop */}
            <div className="grid gap-xl md:grid-cols-2 lg:grid-cols-3">
                {homeContent.serviceCards.map((card, index) => {
                    const Icon = iconMap[card.icon as keyof typeof iconMap];

                    return (
                        <MotionLink
                            key={card.id}
                            to={card.href}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { type: "spring", stiffness: 50, delay: index * 0.15 }
                                }
                            }}
                            whileHover={{
                                y: -8,
                                boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                            }}
                            className={cn(
                                "group relative flex flex-col items-start self-stretch justify-between rounded-xl border bg-white p-md transition-all duration-300 gap-[10px]",
                                // Base State: Gray Border
                                "border-border-default",
                                // Hover State: Orange Border
                                "hover:border-primary-500",
                                // Bento Logic: First card spans 2 columns on tablet (md), 1 on desktop (lg)
                                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
                            )}
                        >
                            <div className="flex flex-col items-start gap-[10px] w-full">
                                <div
                                    className={cn(
                                        "inline-flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300",
                                        // Base: Gray BG, Orange Icon
                                        "bg-gray-100 text-primary-500",
                                        // Hover: Orange BG, White Icon
                                        "group-hover:bg-primary-500 group-hover:text-white"
                                    )}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>

                                <div className="space-y-3 w-full">
                                    <h3 className="text-2xl font-bold tracking-tight text-content-primary group-hover:text-content-primary">
                                        {card.title}
                                    </h3>
                                    <p className="text-content-secondary leading-relaxed font-normal">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-0">
                                <div
                                    className={cn(
                                        "inline-flex items-center gap-xs text-sm font-medium transition-colors duration-300",
                                        // Base: Gray Text
                                        "text-content-secondary",
                                        // Hover: Orange Text
                                        "group-hover:text-primary-500 group-hover:gap-sm"
                                    )}
                                >
                                    Explore
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </MotionLink>
                    );
                })}
            </div>
        </section>
    );
}
