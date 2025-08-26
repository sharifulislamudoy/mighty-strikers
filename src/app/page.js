import Image from "next/image";
import HeroSection from "./Components/HeroSection";
import AboutSection from "./Components/AboutSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
    </div>
  );
}
