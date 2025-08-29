import AboutSection from "./Components/AboutSection";
import FounderSection from "./Components/FounderSection";
import HeroSection from "./Components/HeroSection";
import PerformanceAnalytics from "./Components/PerformanceAnalytics";

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
