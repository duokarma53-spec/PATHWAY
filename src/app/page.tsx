import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { StudyAbroad } from "@/components/sections/StudyAbroad";
import { MedicalEducation } from "@/components/sections/MedicalEducation";
import { Process } from "@/components/sections/Process";
import { WhyPathway } from "@/components/sections/WhyPathway";
import { Testimonials } from "@/components/sections/Testimonials";
import { Partners } from "@/components/sections/Partners";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <About />
      <Services />
      <StudyAbroad />
      <MedicalEducation />
      <Process />
      <WhyPathway />
      <Testimonials />
      <Partners />
      <PhotoGallery />
      <FAQ />
      <FinalCTA />
      <Contact />
    </>
  );
}
