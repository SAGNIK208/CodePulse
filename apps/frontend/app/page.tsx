import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CategoriesSection from "../components/CategoriesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";
import Layout from "../components/Layout";

const links = [
  { href: "#features", label: "Features" },
  { href: "#categories", label: "Categories" },
  { href: "#testimonials", label: "Testimonials" },
];

export default function Home() {
  return (
    <div className="bg-white text-[#1E293B] font-inter">
      <Layout links={links}>
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection />
        <TestimonialsSection />
        <Footer />
      </Layout>
    </div>
  );
}
