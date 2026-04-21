"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, addItem, removeItem, clearCart, totalAmount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    const phoneNumber = "6285172288383"; // Placeholder or real number
    const itemsList = items
      .map((i) => `* ${i.name} (${i.quantity}x) @ ${i.price}`)
      .join("\n");
    const message = `Halo Warkop Agam, saya ingin memesan:\n\n${itemsList}\n\n*Total Estimasi: Rp ${totalAmount.toLocaleString()}*\n\n_Pesanan dari Website AgamWeb_`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[95%] sm:w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-5 sm:py-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-primary-brown" />
              <h2 className="text-lg sm:text-xl font-bold text-black uppercase tracking-widest leading-none">Keranjang</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-6 bg-white">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-200" />
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-base sm:text-lg">Keranjang Kosong</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Ayo pilih menu favoritmu!</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-primary-brown text-white px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all text-xs sm:text-sm"
                >
                  LIHAT MENU
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.name} className="flex justify-between items-center bg-gray-50/50 p-3 sm:p-4 rounded-2xl gap-2">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wide line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-primary-brown font-bold text-xs sm:text-sm whitespace-nowrap">{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                    <button
                      onClick={() => removeItem(item.name)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-gray-800 w-4 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => addItem({ name: item.name, price: item.price })}
                      className="text-gray-400 hover:text-primary-brown transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-4 sm:px-6 py-5 sm:py-6 border-t bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center mb-2 gap-2">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  Rp {totalAmount.toLocaleString()}
                </span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-primary-brown text-white py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-primary-brown/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                PESAN SEKARANG (WA)
              </button>
              
              <button
                onClick={clearCart}
                className="w-full text-gray-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-tight sm:tracking-widest flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Kosongkan Keranjang
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
