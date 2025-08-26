import Image from "next/image";
import HeroSection from "./Components/HeroSection";
import AboutSection from "./Components/AboutSection";
import PerformanceAnalytics from "./Components/PerformanceAnalytics";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <PerformanceAnalytics />
    </div>
  );
}
