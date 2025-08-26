import Image from "next/image";
import HeroSection from "./Components/HeroSection";
import AboutSection from "./Components/AboutSection";
import PerformanceAnalytics from "./Components/PerformanceAnalytics";
import FounderSection from "./Components/FounderSection";
import CommunityImpact from "./Components/CommunityImpact";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <FounderSection />
      <PerformanceAnalytics />
      <CommunityImpact />
    </div>
  );
}
