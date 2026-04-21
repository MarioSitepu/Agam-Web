"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-32 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
        <div className="lg:w-1/2 space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
          <h4 className="text-primary-brown uppercase tracking-widest font-bold text-xs sm:text-sm md:text-base">About Us</h4>
          <h2 className="text-black font-script text-4xl sm:text-5xl md:text-8xl leading-tight">Our Story</h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
            Warkop Agam brings the authentic soul of Medan's culinary traditions to your table. 
            From our signature Mie Sop Medan to the perfectly "pulled" Teh Tarek, every dish is crafted 
            with recipes passed down through generations. Experience the warmth of a true Medan coffee shop.
          </p>
          <div className="pt-2 sm:pt-4">
            <button className="w-full sm:w-auto text-primary-brown border-2 border-primary-brown font-bold text-base sm:text-lg md:text-xl px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-primary-brown hover:text-white transition-all shadow-lg active:scale-95">
              Read Our Full Story
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative h-[300px] sm:h-[400px] md:h-[600px] w-full order-1 lg:order-2">
          {/* Circular Image Background */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl z-0 border-4 sm:border-8 md:border-[10px] border-white ring-1 ring-gray-100 scale-100 md:scale-110">
            <Image
              src="/about-warkop.png"
              alt="Warkop Interior"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Overlapping Rounded Image */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 md:bottom-0 md:left-0 w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] md:w-[350px] md:h-[350px] rounded-2xl sm:rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl z-10 border-4 sm:border-8 md:border-[10px] border-white ring-1 ring-gray-100 transform -rotate-3 md:-rotate-6 scale-100 md:scale-105">
            <Image
              src="/teh-tarek.png"
              alt="Teh Tarek"
              fill
              className="object-cover"
            />
          </div>

          {/* Accent decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-secondary-gold/10 rounded-full blur-xl sm:blur-2xl md:blur-3xl z-[-1] animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
