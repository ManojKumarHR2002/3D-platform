import { NavigationBar } from "../Navigation/NavigationBar";
import { HeroSection } from "../Hero/HeroSection";
import { FeaturesSection } from "../Features/FeaturesSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center bg-zinc-800 h-[193.5vh] overflow-hidden">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
