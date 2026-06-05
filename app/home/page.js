'use client';

import React from 'react';
import { 
  Bell, Search, Wrench, Mountain, Tag, Users, 
  Star, Clock, ChevronRight, Plus, Home, 
  ShoppingBag, Compass, Ticket, User 
} from 'lucide-react';

export default function HomePage() {
  // Mock Data untuk Trending Spots
  const trendingSpots = [
    {
      id: 1,
      title: 'Lake Semeru, East Java',
      duration: '2 Days Trek',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: 'Pine Sanctuary',
      duration: 'Overnight',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // Mock Data untuk Recommended Stores
  const recommendedStores = [
    {
      id: 1,
      name: 'WildPeak Gear Shop',
      desc: 'Elite gear & expert advice',
      icon: '🏔️'
    },
    {
      id: 2,
      name: 'Basecamp Rentals',
      desc: 'Tents, stoves, and more',
      icon: '⛺'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7faf9] flex justify-center items-flex-start font-sans antialiased text-black selection:bg-[#b6f309]">
      {/* Container utama dibuat max-width 450px agar persis tiruan aplikasi mobile */}
      <div className="w-full max-w-[450px] bg-white min-h-screen shadow-lg relative pb-24 flex flex-col">
        
        {/* ================= HEADER ================= */}
        <div className="px-5 pt-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#061b0e]">Explore Campsites</h1>
          </div>
          <button className="relative p-1 hover:bg-gray-100 rounded-full transition-all">
            <Bell className="w-5 h-5 text-gray-800" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="px-5 mt-5">
          <div className="w-full bg-[#f1f4f3] rounded-2xl flex items-center px-4 py-3.5 gap-3 border border-transparent focus-within:border-gray-200 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for gear or spots..." 
              className="bg-transparent border-none outline-none w-full text-[14px] placeholder-gray-400"
            />
          </div>
        </div>

        {/* ================= FEATURED BANNER ================= */}
        <div className="px-5 mt-5">
          <div className="relative w-full h-[190px] rounded-[28px] overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80" 
              alt="Weekend at Mount Rinjani" 
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient Hitam transparan */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-max tracking-wider uppercase mb-2">
                Featured
              </span>
              <h2 className="text-white font-bold text-[22px] leading-tight tracking-wide">
                Weekend at<br />Mount Rinjani
              </h2>
              <p className="text-white/70 text-[12px] mt-1">Join the community trek this June.</p>
            </div>
          </div>
        </div>

        {/* ================= QUICK MENU CATEGORIES ================= */}
        <div className="px-5 mt-6 grid grid-cols-4 gap-3 text-center">
          {/* Menu 1 */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-[60px] h-[60px] bg-[#b6f309] rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-transform">
              <Wrench className="w-6 h-6 text-[#061b0e]" />
            </div>
            <span className="text-[12px] font-semibold text-gray-700">Sewa Alat</span>
          </div>
          {/* Menu 2 */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-[60px] h-[60px] bg-[#e1eae7] rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-transform">
              <Mountain className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-[12px] font-semibold text-gray-700 leading-tight">Spot Camping</span>
          </div>
          {/* Menu 3 */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-[60px] h-[60px] bg-[#ffe1e1] rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-transform">
              <Tag className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-[12px] font-semibold text-gray-700">Promo</span>
          </div>
          {/* Menu 4 */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-[60px] h-[60px] bg-[#e1f3eb] rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-transform">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[12px] font-semibold text-gray-700">Komunitas</span>
          </div>
        </div>

        {/* ================= TRENDING SPOTS SECTION ================= */}
        <div className="mt-8 pl-5">
          <div className="flex justify-between items-center pr-5 mb-3">
            <h3 className="text-[17px] font-bold text-[#061b0e]">Trending Spots</h3>
            <button className="text-[13px] font-bold text-[#4b6700] hover:underline">View All</button>
          </div>
          
          {/* Horizontal Scroll Wrapper */}
          <div className="flex gap-4 overflow-x-auto pr-5 pb-2 scrollbar-none snap-x snap-mandatory">
            {trendingSpots.map((spot) => (
              <div key={spot.id} className="min-w-[220px] w-[220px] bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm flex-shrink-0 snap-start">
                <div className="relative h-[130px] w-full">
                  <img src={spot.image} alt={spot.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 text-[11px] font-bold text-black shadow-sm">
                    <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                    <span>{spot.rating}</span>
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <h4 className="font-bold text-[13.5px] tracking-wide text-gray-900 line-clamp-1">{spot.title}</h4>
                  <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{spot.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RECOMMENDED STORES SECTION ================= */}
        <div className="mt-6 px-5">
          <h3 className="text-[17px] font-bold text-[#061b0e] mb-3">Recommended Stores</h3>
          <div className="space-y-3">
            {recommendedStores.map((store) => (
              <div key={store.id} className="w-full bg-[#f1f4f3] rounded-2xl p-3 flex items-center justify-between hover:bg-gray-100 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-[46px] h-[46px] bg-white rounded-xl flex items-center justify-center text-[20px] shadow-sm">
                    {store.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[13.5px] text-gray-900">{store.name}</h4>
                    <p className="text-gray-400 text-[11px] font-medium">{store.desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-[#b6f309] rounded-full flex items-center justify-center shadow-sm">
                  <ChevronRight className="w-4 h-4 text-[#061b0e]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FLOATING ACTION BUTTON (FAB) ================= */}
        <div className="absolute bottom-20 right-5 z-20">
          <button className="w-12 h-12 bg-[#b6f309] rounded-full flex items-center justify-center shadow-lg hover:bg-[#a1d800] active:scale-95 transition-all text-[#061b0e]">
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* ================= BOTTOM NAVIGATION BAR ================= */}
        <div className="absolute bottom-0 left-0 right-0 h-18 bg-white border-t border-gray-100 px-6 flex justify-between items-center z-10">
          <button className="flex flex-col items-center text-[#4b6700] gap-0.5">
            <Home className="w-5 h-5 fill-current" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button className="flex flex-col items-center text-gray-400 hover:text-[#4b6700] gap-0.5 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-medium">Sewa</span>
          </button>

          <button className="flex flex-col items-center text-gray-400 hover:text-[#4b6700] gap-0.5 transition-colors">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">Tracking</span>
          </button>

          <button className="flex flex-col items-center text-gray-400 hover:text-[#4b6700] gap-0.5 transition-colors">
            <Ticket className="w-5 h-5" />
            <span className="text-[10px] font-medium">Ticket</span>
          </button>

          <button className="flex flex-col items-center text-gray-400 hover:text-[#4b6700] gap-0.5 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
}