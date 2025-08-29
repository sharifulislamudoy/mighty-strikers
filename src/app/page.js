import AboutSection from "./components/AboutSection";
import FounderSection from "./components/FounderSection";
import HeroSection from "./components/HeroSection";
import PerformanceAnalytics from "./components/PerformanceAnalytics";


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
