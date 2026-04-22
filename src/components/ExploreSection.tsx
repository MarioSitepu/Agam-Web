"use client";

import { useState } from "react";
import Image from "next/image";
import { menuData } from "@/data/menuData";
import { Plus, Flame, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ExploreSection() {
  const [activeTab, setActiveTab] = useState(menuData[0].id);
  const activeCategory = menuData.find((cat) => cat.id === activeTab);
  const { addItem } = useCart();

  return (
    <section id="menu" className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-16 px-4">
          <h4 className="text-primary-brown uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-xs sm:text-sm mb-3 sm:mb-4">Our Recommendation</h4>
          <h2 className="text-black font-script text-5xl sm:text-6xl md:text-8xl text-center">Makan & Minum</h2>
        </div>
        
        {/* Category Tabs */}
        <div className="flex items-center lg:justify-center gap-4 sm:gap-6 md:gap-10 mb-10 sm:mb-12 md:mb-16 border-b border-gray-100 pb-4 sm:pb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`text-base sm:text-lg md:text-xl font-bold transition-all relative pb-2 px-2 uppercase tracking-tight ${
                activeTab === cat.id ? "text-primary-brown scale-105" : "text-gray-400 hover:text-black"
              }`}
            >
              {cat.name}
              {activeTab === cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-brown rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Menu Items Grid - IMAGE BASED */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {activeCategory?.items.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl md:rounded-[2.5rem] p-2 md:p-6 flex flex-col group relative transition-all hover:bg-white hover:shadow-2xl hover:shadow-primary-brown/10 border border-transparent hover:border-primary-brown/5 h-full"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-2 sm:mb-6 overflow-hidden rounded-lg sm:rounded-4xl shadow-lg">
                <Image
                  src={item.image || "/placeholder-food.png"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Badge for Featured */}
                {item.isFeatured && (
                  <div className="absolute top-1.5 sm:top-4 left-1.5 sm:left-4 bg-[#FFB800] text-black text-[5px] sm:text-[10px] font-black px-1 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase flex items-center gap-0.5 sm:gap-1 shadow-lg z-10">
                     <Flame className="w-1.5 sm:w-3 h-1.5 sm:h-3 fill-black" />
                     <span>Best Seller</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Product Info */}
              <div className="w-full grow flex flex-col">
                <div className="min-h-7 xs:min-h-9 sm:min-h-12 md:min-h-16 mb-1 sm:mb-2 flex justify-between items-start gap-1">
                   <h3 className="text-[10px] xs:text-xs sm:text-base md:text-xl font-bold text-gray-900 group-hover:text-primary-brown transition-colors uppercase leading-tight line-clamp-2 flex-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-0.5 text-[#FFB800] shrink-0">
                    <Star className="w-2 sm:w-4 h-2 sm:h-4 fill-[#FFB800]" />
                    <span className="text-[7px] sm:text-xs font-bold text-gray-600">4.8</span>
                  </div>
                </div>
                
                {item.description ? (
                  <p className="hidden xs:block text-gray-500 text-[9px] sm:text-sm mb-2 sm:mb-4 line-clamp-2">{item.description}</p>
                ) : (
                  <div className="grow"></div>
                )}
                
                <div className="mt-auto flex justify-between items-center pt-1.5 sm:pt-4 border-t border-gray-100 group-hover:border-primary-brown/20 transition-colors gap-1.5">
                  <span className="text-[10px] xs:text-sm sm:text-2xl font-black text-gray-900 bg-primary-brown/5 px-1.5 sm:px-4 py-0.5 sm:py-1 rounded-md sm:rounded-xl">
                    {item.price}
                  </span>
                  
                  <button
                    onClick={() => addItem({ name: item.name, price: item.price })}
                    className="bg-primary-brown text-white w-7 h-7 xs:w-8 xs:h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl shadow-xl shadow-primary-brown/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group/add shrink-0"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-6 sm:h-6 group-hover/add:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
