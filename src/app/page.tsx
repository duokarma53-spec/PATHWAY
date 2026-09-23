import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { StudyAbroad } from "@/components/sections/StudyAbroad";
import { MedicalEducation } from "@/components/sections/MedicalEducation";
import { Process } from "@/components/sections/Process";
import { WhyPathway } from "@/components/sections/WhyPathway";
import { LatestNews } from "@/components/sections/LatestNews";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { Contact } from "@/components/sections/Contact";
import { FAQ } from "@/components/sections/FAQ";

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
      <LatestNews />
      <PhotoGallery />
      <Contact />
      <FAQ />
    </>
  );
}
