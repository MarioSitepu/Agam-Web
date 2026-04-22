"use client";

import Image from "next/image";
import { Star, Phone, Flame, Smile, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-[#111111] pt-20 sm:pt-24 pb-8 sm:pb-12 flex items-center overflow-hidden px-4 sm:px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-8 items-center">
        
        {/* Left Content */}
        <div className="relative z-10 flex flex-col items-start text-left order-2 lg:order-1 pt-6 xs:pt-10 lg:pt-0">
          <h1 className="text-white font-sans text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.2] sm:leading-[1.1] tracking-tight mb-4 sm:mb-6">
            Cita Rasa Asli <br />
            <span className="text-[#FFB800]">Warkop Agam!</span>
          </h1>
          
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-lg mb-6 sm:mb-10 leading-relaxed">
            The Authentic Medan Concept. Nikmati sajian mie aceh, kopi sanger, dan hidangan khas Medan lainnya dengan balutan bumbu rempah pilihan yang menggugah selera.
          </p>
          
          <a href="#menu" className="w-full sm:w-auto text-center bg-[#FFB800] text-black px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-[0_4px_20px_rgba(255,184,0,0.3)] active:scale-95">
            Our Menu
          </a>

          {/* Social Proof */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-white/10 pt-6 sm:pt-8 w-full md:w-auto">
            <div className="flex -space-x-3">
              {[
                { color: "bg-red-400", icon: <Smile className="w-5 h-5 text-white" /> },
                { color: "bg-blue-400", icon: <Heart className="w-5 h-5 text-white" /> },
                { color: "bg-green-400", icon: <Star className="w-5 h-5 text-white" /> }
              ].map((avatar, i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-2 border-[#111111] overflow-hidden ${avatar.color} flex items-center justify-center shadow-lg relative z-${30 - i * 10}`}>
                   {avatar.icon}
                </div>
              ))}
            </div>
            <div className="flex flex-col mt-2 sm:mt-0">
              <span className="text-white text-sm font-medium">Our Happy Customers</span>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                <span className="text-white font-bold text-sm">4.8</span>
                <span className="text-gray-400 text-sm">(18.5k Reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image/Visuals */}
        <div className="relative z-10 w-full h-[300px] xs:h-[380px] sm:h-[450px] md:h-[500px] lg:h-[600px] flex justify-center items-center order-1 lg:order-2 overflow-hidden scale-90 xs:scale-100 lg:scale-110">
          
          {/* Main Circular Image */}
          <div className="relative w-[220px] h-[220px] xs:w-[300px] xs:h-[300px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full p-2 border-2 border-dashed border-[#FFB800]/50 animate-[spin_60s_linear_infinite] hover:animate-none">
             <div className="w-full h-full rounded-full overflow-hidden relative shadow-2xl">
                <Image
                  src="/hero-warkop.png" 
                  alt="Warkop Agam Dish"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
             </div>
          </div>

          {/* Floating Badge 1 (Courier/Delivery) */}
          <div className="absolute top-4 sm:top-[5%] md:top-[10%] left-2 sm:left-4 lg:left-0 bg-[#1A1A1A] rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 shadow-2xl border border-white/5 animate-bounce text-xs sm:text-sm z-20" style={{animationDuration: '3s'}}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#333333] overflow-hidden flex items-center justify-center border border-white/10">
              <span className="text-[#FFB800] font-bold text-[10px] sm:text-xs uppercase">Agam</span>
            </div>
            <div>
              <p className="text-white text-xs sm:text-xs font-bold leading-tight line-clamp-1">Fast Delivery</p>
              <p className="text-gray-400 text-[9px] sm:text-[10px] leading-tight">Warkop Courier</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[rgba(255,184,0,0.1)] flex items-center justify-center ml-1 sm:ml-2 border border-[#FFB800]/20 flex-shrink-0">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFB800]" />
            </div>
          </div>

          {/* Floating Badge 2 (Price/Rating) */}
          <div className="absolute bottom-4 sm:bottom-[5%] md:bottom-[10%] right-2 sm:right-4 lg:right-0 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-2xl flex items-center gap-2 sm:gap-4 animate-bounce text-xs sm:text-sm z-20" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}>
             <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden relative bg-gray-200 border-2 border-white shadow-inner flex-shrink-0">
                <Image src="/hero-warkop.png" alt="Mie Aceh" fill className="object-cover" />
             </div>
             <div>
                <p className="text-black font-bold text-xs sm:text-sm line-clamp-1">Mie Aceh</p>
                <div className="flex items-center gap-0.5 sm:gap-1 my-0.5 sm:my-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFB800] fill-[#FFB800]" />
                  ))}
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-300 fill-gray-300" />
                </div>
                <p className="text-black font-bold text-xs sm:text-lg leading-none">Rp 25.000</p>
             </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-[20%] right-[8%] sm:right-[10%] w-2 h-2 sm:w-3 sm:h-3 bg-[#FFB800] rounded-sm transform rotate-45 animate-pulse"></div>
          <div className="absolute top-[60%] right-[5%] w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-ping" style={{animationDuration: '2s'}}></div>
          <div className="absolute bottom-[20%] left-[8%] sm:left-[10%] w-2 h-2 sm:w-4 sm:h-4 border-2 border-[#FFB800] rounded-full opacity-60"></div>
          
          <div className="absolute top-[5%] right-[20%] sm:right-[25%] md:right-[30%] bg-white p-1.5 sm:p-2 rounded-full shadow-lg transform hover:scale-110 transition-transform">
             <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
          <div className="absolute bottom-[5%] left-[15%] sm:left-[20%] md:left-[30%] bg-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl rounded-full shadow-lg leading-none transform hover:scale-110 transition-transform">
             😋
          </div>
        </div>

      </div>
    </section>
  );
}
