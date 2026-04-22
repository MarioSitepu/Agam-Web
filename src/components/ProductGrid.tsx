"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductProps {
  name: string;
  price: string;
  image: string;
}

function ProductCard({ name, price, image }: ProductProps) {
  const { addItem } = useCart();

  return (
    <div className="bg-bg-dark rounded-lg sm:rounded-3xl p-2 sm:p-5 md:p-6 flex flex-col items-center group relative h-full transition-all hover:shadow-2xl hover:shadow-primary-brown/10">
      <div className="relative w-full aspect-square mb-1.5 sm:mb-4 md:mb-6 overflow-hidden rounded-md sm:rounded-2xl">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-110"
        />
      </div>
      
      <div className="flex-1 w-full flex flex-col">
        <div className="min-h-[1.75rem] xs:min-h-[2.25rem] sm:min-h-[3.5rem] md:min-h-[4rem] mb-1 sm:mb-2">
          <h3 className="text-white text-[10px] xs:text-xs sm:text-xl md:text-2xl font-bold uppercase tracking-wider line-clamp-2 leading-tight text-center">{name}</h3>
        </div>
        
        <div className="mt-auto w-full flex justify-between items-center pt-1.5 sm:pt-2 border-t border-white/10">
          <span className="text-secondary-gold text-[10px] xs:text-sm sm:text-2xl md:text-3xl font-bold">{price}</span>
          
          <button 
            onClick={() => addItem({ name, price })}
            className="bg-primary-brown text-white p-1.5 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-opacity-80 transition-all flex items-center justify-center active:scale-90 group/btn"
            aria-label={`Add ${name} to cart`}
          >
            <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

const topProducts = [
  { name: "Mie Sop Medan", price: "29K", image: "/mie-sop.png" },
  { name: "Teh Tarek", price: "16K", image: "/teh-tarek.png" },
  { name: "Soto Ayam", price: "17K", image: "/soto-ayam.png" },
];

export default function ProductGrid() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h4 className="text-primary-brown uppercase tracking-widest mb-1 sm:mb-2 md:mb-4 font-bold text-xs sm:text-sm md:text-base">Featured</h4>
          <h2 className="text-black font-script text-4xl sm:text-5xl md:text-7xl">Top Products</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {topProducts.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
