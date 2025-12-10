import { Hero } from "@/components/home/Hero";
import { ServiceCards } from "@/components/home/ServiceCards";
import { ProfileSection } from "@/components/home/ProfileSection";

export default function Home() {
    return (
        <main className="flex flex-col gap-lg">
            <Hero />
            <ServiceCards />
            <ProfileSection />
        </main>
    );
}
