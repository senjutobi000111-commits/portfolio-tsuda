import Navbar from "@/components/navbar/navbar";
import HeroSection from "@/components/sections/hero/hero-section";
import AboutSection from "@/components/sections/about/about-section";
import ServicesSection from "@/components/sections/services/services-section";
import ProcessSection from "@/components/sections/process/process-section";
import PackagesSection from "@/components/sections/packages/packages-section";
import ProjectsSection from "@/components/sections/projects/projects-section";
import BlogSection from "@/components/sections/blog/blog-section";
import ContactSection from "@/components/sections/contact/contact-section";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <PackagesSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
}
