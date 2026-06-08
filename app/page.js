'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const buttonRef = useRef(null);

  // Efek mikro-interaksi kustom pada tombol utama saat mouse bergerak
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--x', `${x}px`);
      btn.style.setProperty('--y', `${y}px`);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Catatan: Font & Icon dipindahkan ke app/layout.js agar global dan aman */}
      
      {/* Style Kustom Terisolasi untuk Halaman Utama */}
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          min-height: max(884px, 100vh);
          overflow: hidden;
        }
        .font-display {
          font-family: 'Montserrat', sans-serif;
        }
        .glass-container {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .hero-gradient {
          background: linear-gradient(to top, rgba(6, 27, 14, 0.8) 0%, rgba(6, 27, 14, 0) 60%);
        }
        .button-interaction:active {
          transform: scale(0.96);
        }
        :root {
          --primary: #061b0e;
          --primary-container: #1b3022;
          --secondary: #4b6700;
          --secondary-fixed: #b9f612;
          --on-secondary-fixed: #141f00;
          --secondary-container: #b6f309;
          --background: #f7fafb;
          --on-background: #181c1d;
          --on-surface-variant: #434843;
          --outline-variant: #c3c8c1;
        }
      `}</style>
               
      {/* Wadah Logo */}
      <div className="relative z-10 flex justify-center mt-[60px] mb-[0px] ml-[0px]">
        <Image 
          src="/logo-campyuk-hitam.png" 
          alt="camppyuk logo"
          width={96}  
          height={96} 
          className="object-contain filter drop-shadow-[0_0_10px_rgba(185,246,12,0.4)]"
          priority
        />
      </div>
         
      <div className="relative text-[--on-background] min-h-screen w-full bg-[--background] overflow-hidden">
        
        {/* Foto Latar Belakang Layar Penuh */}
        <div className="fixed inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Misty forest at sunrise" 
            src="/bg-before-login.png" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061b0e]/10 via-[#061b0e]/20 to-transparent"></div>
        </div>

        {/* Konten Utama Terbawah (Slide up panel) */}
        <main className="relative z-10 flex flex-col justify-end min-h-screen">
          
          {/* Wadah Panel Kaca di Bagian Bawah */}
          <div className="bg-white/80 rounded-t-[40px] px-5 pt-12 pb-[200px] shadow-2xl flex flex-col items-center text-center">
            
            {/* Garis Aksen Branding Wilder */}
            <div className="w-12 h-1.5 bg-[--primary]/10 rounded-full mb-6 mx-auto"></div>
            
            <div className="space-y-3 max-w-md">
              {/* Judul Utama */}
              <h1 className="font-display text-[32px] font-bold text-black tracking-tight leading-[40px]">
                Petualangan Seru Menantimu
              </h1>
              {/* Sub-judul */}
              <p className="text-[16px] text-black leading-relaxed font-normal">
                Booking spot camping dan sewa alat outdoor jadi lebih mudah, transparan, dan terpercaya.
              </p>
            </div>

            {/* Bagian Tombol Aksi */}
            <div className="w-full mt-12 space-y-4 max-w-xs">
              
              {/* Tombol Utama (Mulai Sekarang) */}
              <Link 
                href="/login"
                ref={buttonRef}
                className="flex items-center justify-center w-full h-[56px] bg-[#b6f309] text-[#061b0e] text-[16px] font-bold rounded-full shadow-[0_8px_20px_rgba(182,243,9,0.4)] hover:bg-[#a1d800] transition-all duration-200 button-interaction"
              >
                Mulai Sekarang
                <span className="material-symbols-outlined ml-2 font-bold" style={{ fontVariationSettings: "'wght' 700" }}>
                  arrow_forward
                </span>
              </Link>

              {/* Indikator Halaman (Dots Slider) */}
              <div className="flex justify-center gap-2 pt-2">
                <div className="h-1.5 w-6 rounded-full bg-[--secondary]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[--outline-variant]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[--outline-variant]"></div>
              </div>

            </div>
          </div>
        </main>

        {/* Dekorasi Estetik: Hamparan Partikel Cahaya Halus */}
        <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[--secondary-fixed]/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[--primary-container]/20 blur-[120px] rounded-full"></div>
        </div>

      </div>
    </>
  );
}