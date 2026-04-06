import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import ExploreSection from "@/components/ExploreSection";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProductGrid />
      <PromoBanner />
      <ExploreSection />
      <AboutUs />
      <Footer />
    </main>
  );
}
