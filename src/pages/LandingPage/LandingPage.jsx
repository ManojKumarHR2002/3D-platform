import { NavigationBar } from "../../components/LandingPage/Navigation/NavigationBar";
import { HeroSection } from "../../components/LandingPage/Hero/HeroSection";
import { FeaturesSection } from "../../components/LandingPage/Features/FeaturesSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center bg-zinc-800 h-[193.5vh] overflow-hidden">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
