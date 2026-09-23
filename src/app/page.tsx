import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { StudyAbroad } from "@/components/sections/StudyAbroad";
import { MedicalEducation } from "@/components/sections/MedicalEducation";
import { WhyPathway } from "@/components/sections/WhyPathway";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { LatestNews } from "@/components/sections/LatestNews";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <StudyAbroad />
      <MedicalEducation />
      <WhyPathway />
      <Process />
      <Testimonials />
      <LatestNews />
      <PhotoGallery />
      <FAQ />
      <Contact />
      <FinalCTA />
    </>
  );
}
