import React from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { ServicesPreview } from "../../components/home/ServicesPreview";
import { WhyUs } from "../../components/home/WhyUs";
import { TeamPreview } from "../../components/home/TeamPreview";
import { GalleryPreview } from "../../components/home/GalleryPreview";
import { TestimonialsSlider } from "../../components/home/TestimonialsSlider";
import { StatsBar } from "../../components/home/StatsBar";
import { CTASection } from "../../components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <WhyUs />
      <TeamPreview />
      <GalleryPreview />
      <TestimonialsSlider />
      <StatsBar />
      <CTASection />
    </>
  );
}
