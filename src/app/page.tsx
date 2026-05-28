import Navbar from "@/components/navbar/navbar";
import HeroSection from "@/components/sections/hero/hero-section";
import AboutSection from "@/components/sections/about/about-section";
import ProjectsSection from "@/components/sections/projects/projects-section";
import ContactSection from "@/components/sections/contact/contact-section";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
