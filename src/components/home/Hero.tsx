import { motion } from "framer-motion";
import { homeContent } from "@/data/home-content";

export function Hero() {
    const { headline, subheadline } = homeContent.hero;

    return (
        <section className="container mx-auto px-lg py-3xl max-w-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl space-y-md"
            >
                <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-content-primary whitespace-pre-line md:text-6xl lg:text-7xl">
                    {headline}
                </h1>
                <p className="text-xl text-content-secondary font-normal md:text-2xl pt-2xs">
                    {subheadline}
                </p>
            </motion.div>
        </section>
    );
}
