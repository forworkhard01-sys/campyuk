'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // BARU: Untuk pindah halaman setelah sukses login
import { loginUser } from './actions'; // BARU: Import fungsi server action login

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  // BARU: State untuk menampung data form input dan feedback info
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cardRef = useRef(null);

  // Efek Dekoratif Parallax Mouse (Tetap dipertahankan)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      if (!card) return;

      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    const handleMouseLeave = () => {
      const card = cardRef.current;
      if (card) card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // BARU: Fungsi Handler ketika form di-Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await loginUser(username, password);
      
      if (result?.success) {
        // Opsional: Simpan session/state user ID jika diperlukan di sini
        // Alihkan user langsung masuk ke Dashboard utama Campyuk
        router.push('/home');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Menyisipkan Font & Ikon Eksternal */}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Style Kustom Terisolasi */}
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          min-height: max(884px, 100vh);
        }
        .font-display {
          font-family: 'Montserrat', sans-serif;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Background Utama Terluar */}
      <div className="relative text-[#181c1d] min-h-screen w-full flex items-start justify-center overflow-hidden bg-[#f7fafb] pt-15">
        
        {/* Layer Gambar Latar Belakang */}
        <div className="fixed inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Misty forest at sunrise" 
            src="/bg-login.png" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#061b0e]/80 via-[#061b0e]/30 to-transparent"></div>
        </div>

        {/* Konten Utama Canvas */}
        <main className="relative z-10 w-full max-w-105 px-5 md:px-0" style={{ perspective: '1000px' }}>
          
          <header className="text-center mb-12 flex flex-col items-center">
            <div className="relative z-10 mb-2 flex justify-center">
              <Image 
                src="/logo-campyuk-hitam.png" 
                alt="camppyuk logo"
                width={96}  
                height={96} 
                className="object-contain filter drop-shadow-[0_0_10px_rgba(185,246,12,0.4)]"
              />
            </div>
          </header>

          {/* Kartu Login (Glass Panel) */}
          <section 
            ref={cardRef} 
            className="glass-panel rounded-xl p-8 shadow-2xl transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h2 className="font-display text-[20px] font-bold text-[#061b0e] mb-6 leading-7">
              Welcome Back
            </h2>
            
            {/* BARU: Memasang Alert Error jika validasi gagal */}
            {errorMsg && (
              <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-[13px] font-medium leading-5">
                {errorMsg}
              </div>
            )}
            
            {/* DI-UPDATE: Mengikat fungsi onSubmit ke handler login */}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              
              {/* Input Username */}
              <div className="space-y-2">
                <label className="block text-[14px] font-semibold text-[#434843] ml-2 leading-5" htmlFor="username">
                  Username
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737973] group-focus-within:text-[#a1d800] transition-colors">
                    person
                  </span>
                  {/* DI-UPDATE: value dan onChange terikat ke state username */}
                  <input 
                    className="w-full bg-[#f1f4f5] border-none rounded-xl py-4 pl-12 pr-4 text-[16px] text-[#181c1d] focus:ring-2 focus:ring-[#b9f612] transition-all placeholder:text-[#c3c8c1] focus:outline-none" 
                    id="username" 
                    placeholder="Enter your username" 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[14px] font-semibold text-[#434843] leading-5" htmlFor="password">
                    Password
                  </label>
                  <a className="text-[12px] font-semibold text-[#4b6700] hover:text-[#a1d800] transition-colors leading-4" href="#">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737973] group-focus-within:text-[#a1d800] transition-colors">
                    lock
                  </span>
                  {/* DI-UPDATE: value dan onChange terikat ke state password */}
                  <input 
                    className="w-full bg-[#f1f4f5] border-none rounded-xl py-4 pl-12 pr-12 text-[16px] text-[#181c1d] focus:ring-2 focus:ring-[#b9f612] transition-all placeholder:text-[#c3c8c1] focus:outline-none" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737973] hover:text-[#061b0e] transition-colors flex items-center" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Tombol Kirim Form (Ditambahkan state Disabled & Loading text) */}
              <button 
                className="w-full bg-[#b6f309] text-[#141f00] py-4 rounded-full text-[14px] font-bold shadow-lg hover:bg-[#a1d800] active:scale-95 transition-all duration-200 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Checking Security...' : 'Login'}
              </button>
            </form>

            {/* Alternatif Login Bergaris Tengah */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#c3c8c1]/40"></div>
                <span className="text-[12px] text-[#737973] leading-4">or continue with</span>
                <div className="h-px flex-1 bg-[#c3c8c1]/40"></div>
              </div>

              {/* Tombol Media Sosial */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 px-4 rounded-xl border border-[#c3c8c1]/50 flex items-center justify-center hover:bg-white/50 transition-colors bg-white/10">
                  <img alt="Google" className="w-5 h-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                  <span className="text-[14px] font-semibold text-[#061b0e]">Google</span>
                </button>
                <button className="flex-1 py-3 px-4 rounded-xl border border-[#c3c8c1]/50 flex items-center justify-center hover:bg-white/50 transition-colors bg-white/10">
                  <img alt="Apple" className="w-5 h-5 mr-2" src="https://www.svgrepo.com/show/511330/apple-173.svg" />
                  <span className="text-[14px] font-semibold text-[#061b0e]">Apple</span>
                </button>
              </div>
            </div>
          </section>

          {/* Bagian Pendaftaran (Footer) */}
          <footer className="mt-8 text-center">
            <p className="text-[16px] text-[#d0e9d4]/90 font-normal leading-6">
              New to the wilderness? 
              <Link 
                href="/create_user" 
                className="text-[#b9f612] font-bold hover:underline decoration-[#a1d800] underline-offset-4 ml-1"
              >
                Sign Up
              </Link>
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}