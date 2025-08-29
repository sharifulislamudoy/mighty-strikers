import Image from "next/image";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PerformanceAnalytics from "./components/PerformanceAnalytics";
import FounderSection from "./components/FounderSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <FounderSection />
      <PerformanceAnalytics />
    </div>
  );
}
