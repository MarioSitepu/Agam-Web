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
    <section id="menu" className="bg-white py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h4 className="text-primary-brown uppercase tracking-[0.3em] font-bold text-sm mb-4">Our Recommendation</h4>
          <h2 className="text-black font-script text-6xl md:text-8xl text-center">Makan & Minum</h2>
        </div>
        
        {/* Category Tabs */}
        <div className="flex items-center lg:justify-center gap-6 md:gap-10 mb-12 md:mb-16 border-b border-gray-100 pb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`text-lg md:text-xl font-bold transition-all relative pb-2 px-2 uppercase tracking-tight ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {activeCategory?.items.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-[2.5rem] p-6 flex flex-col group relative transition-all hover:bg-white hover:shadow-2xl hover:shadow-primary-brown/10 border border-transparent hover:border-primary-brown/5"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-[2rem] shadow-lg">
                <Image
                  src={item.image || "/placeholder-food.png"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Badge for Featured */}
                {item.isFeatured && (
                  <div className="absolute top-4 left-4 bg-[#FFB800] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg z-10">
                     <Flame size={12} className="fill-black" />
                     <span>Best Seller</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Product Info */}
              <div className="w-full flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-brown transition-colors uppercase leading-[1.2] max-w-[80%]">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-0.5 text-[#FFB800]">
                    <Star size={14} className="fill-[#FFB800]" />
                    <span className="text-xs font-bold text-gray-600">4.8</span>
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                )}
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 group-hover:border-primary-brown/20 transition-colors">
                  <span className="text-2xl font-black text-gray-900 bg-primary-brown/5 px-4 py-1 rounded-xl">
                    {item.price}
                  </span>
                  
                  <button
                    onClick={() => addItem({ name: item.name, price: item.price })}
                    className="bg-primary-brown text-white w-12 h-12 rounded-2xl shadow-xl shadow-primary-brown/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group/add"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus size={24} className="group-hover/add:rotate-90 transition-transform" />
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
