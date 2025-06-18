// src/app/page.tsx

import LandingNavbar from "@/components/navbar/landingNavbar";
import LandingHero from "@/components/landing/hero";
import PopularCategory from "@/components/landing/popularCategory";
import PopularProducts from "@/components/landing/popularProducts";
import LandingFooter from "@/components/footer/landingFooter";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/contact";



export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-50 text-gray-900 dark:text-gray-800">
      
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <LandingHero />

      {/* Categorías */}
      <PopularCategory />

      {/* Productos Destacados */}
      <PopularProducts/>

      {/* Testimonios */}
      <Testimonials />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <LandingFooter />
      
    </div>
  );
}