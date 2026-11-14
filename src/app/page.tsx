import Hero from "@/components/Hero";
import { Stats, Services, WhyUs, Process, Work, Testimonials, Team, Faq } from "@/components/Sections";
import Contact from "@/components/Contact";
import Pillars from "@/components/Pillars";
import { faqs, showTestimonials, visibleTestimonials } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs, faqPage, ORG_ID, webPage } from "@/lib/schema";

const title = "Digital Marketing Agency in Vaughan & GTA | Smart Solutions";
const description = "Smart Solutions is a digital marketing agency in Vaughan and the GTA: branding, websites, SEO, paid ads and AI marketing automation that work together.";
export const metadata = pageMetadata({ title, description, path: "/" });

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ path: "/", name: title, description, about: { "@id": ORG_ID } }),
          breadcrumbs("/", [{ name: "Home", path: "/" }]),
          faqPage("/", faqs),
        ]}
      />
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
