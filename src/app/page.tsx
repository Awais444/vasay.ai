import Hero from "@/components/Hero";
import { Stats, Services, WhyUs, Process, Work, Testimonials, Team, Faq } from "@/components/Sections";
import Contact from "@/components/Contact";
import Pillars from "@/components/Pillars";
import { showTestimonials, visibleTestimonials } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Overlaps the hero's bottom edge with rounded top corners */}
      <Pillars />
      <Stats />
      <Services />
      <WhyUs />
      <Process />
      <Work />
      {/* Production: hidden until at least 3 quotes are approved (content.ts → showTestimonials). */}
      {showTestimonials && visibleTestimonials.length > 0 && <Testimonials />}
      <Team />
      <Faq />
      <Contact />
    </>
  );
}
