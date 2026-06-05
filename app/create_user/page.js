'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// IMPORT fungsi API dan konfigurasi yang sudah dipisah
import { getJobTypes, checkUsernameAvailability, registerUser } from './actions';

export default function CreateUserPage() {
  // 1. State Form Input
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    birthDate: '',
    fullAddress: '',
    gender: 'Male',
    jobTypeId: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
  });

  // 2. State Khusus Media, Validasi & UI
  const [jobs, setJobs] = useState([]);
  const [usernameStatus, setUsernameStatus] = useState({ loading: false, available: null, message: '' });
  const [idError, setIdError] = useState('');
  
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    match: false,
  });

  const [photoKtp, setPhotoKtp] = useState(null);
  const [photoSelfie, setPhotoSelfie] = useState(null);
  const [activeCamera, setActiveCamera] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  
  const videoRef = useRef(null);

  // ==========================================
  // [EFEK & LOGIKA VALIDASI VIA ACTIONS]
  // ==========================================

  // Ambil data Jenis Pekerjaan saat halaman dimuat
  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getJobTypes();
        setJobs(data);
      } catch (err) {
        console.error("Gagal mengambil data job_type:", err.message);
      }
    }
    fetchJobs();
  }, []);

  // Cek Real-time ketersediaan Username
  useEffect(() => {
    if (!formData.username) {
      setUsernameStatus({ loading: false, available: null, message: '' });
      return;
    }

    const checkUsername = setTimeout(async () => {
      setUsernameStatus({ loading: true, available: null, message: 'Checking...' });
      try {
        const isAvailable = await checkUsernameAvailability(formData.username);
        if (isAvailable) {
          setUsernameStatus({ loading: false, available: true, message: '✅ Username tersedia' });
        } else {
          setUsernameStatus({ loading: false, available: false, message: '❌ Username sudah digunakan' });
        }
      } catch (err) {
        setUsernameStatus({ loading: false, available: false, message: 'Error checking username' });
      }
    }, 600);

    return () => clearTimeout(checkUsername);
  }, [formData.username]);

  // Efek Validasi Password (Real-time)
  useEffect(() => {
    const pass = formData.password;
    const confirmPass = formData.confirmPassword;

    setPasswordErrors({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      specialChar: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pass),
      match: pass === confirmPass && confirmPass.length > 0,
    });
  }, [formData.password, formData.confirmPassword]);

  // Handle Perubahan Input Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'idNumber') {
      if (value.length > 0 && value.length !== 16) {
        setIdError('NIK harus tepat 16 digit.');
      } else {
        setIdError('');
      }
    }
  };

  // ==========================================
  // [LOGIKA KAMERA & BASE64]
  // ==========================================
  const openCamera = async (type) => {
    setActiveCamera(type);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: type === 'selfie' ? 'user' : 'environment' },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert('Gagal mengakses kamera.');
      setActiveCamera(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Data = canvas.toDataURL('image/jpeg', 0.7);
    if (activeCamera === 'ktp') setPhotoKtp(base64Data);
    if (activeCamera === 'selfie') setPhotoSelfie(base64Data);
    closeCamera();
  };

  const closeCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    setCameraStream(null);
    setActiveCamera(null);
  };

  // ==========================================
  // [PROSES SUBMIT SEKARANG JAUH LEBIH BERSIH]
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isPasswordValid = Object.values(passwordErrors).every(Boolean);

    if (formData.idNumber.length !== 16) {
      alert('NIK harus berisi 16 digit.');
      return;
    }
    if (usernameStatus.available === false) {
      alert('Username tidak tersedia.');
      return;
    }
    if (!isPasswordValid) {
      alert('Mohon penuhi semua kriteria keamanan password.');
      return;
    }
    if (!photoKtp || !photoSelfie) {
      alert('Wajib melengkapi foto verifikasi ID.');
      return;
    }

    try {
      // Panggil fungsi registerUser dari file actions.js
      await registerUser({
        full_name: formData.fullName,
        username: formData.username.trim().toLowerCase(),
        birth_date: formData.birthDate,
        full_address: formData.fullAddress,
        gender: formData.gender,
        job_type_id: parseInt(formData.jobTypeId),
        id_number: formData.idNumber,
        foto_ktp: photoKtp,
        foto_selfie_ktp: photoSelfie,
        password: formData.password, 
      });

      alert('Akun Campyuk berhasil dibuat!');
    } catch (err) {
      alert(`Gagal menyimpan data: ${err.message}`);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-[#f4f7f6] flex flex-col items-center py-8 px-4 font-sans selection:bg-[#b6f309]">
        
        <div className="w-full max-w-[450px] bg-white rounded-[32px] shadow-xl overflow-hidden border border-[#edf2f1]">
          
          {/* Header Banner */}
          <div className="relative h-[160px] w-full">
            <img 
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80"
              alt="Mountain View" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h1 className="font-['Montserrat'] text-[24px] font-bold text-white tracking-wide">Join Campyuk</h1>
              <p className="text-white/80 text-[13px] mt-0.5">Start your journey into the wild today.</p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Section: Personal Details */}
            <div className="flex items-center gap-2 text-[#061b0e] font-bold text-[16px] border-b border-gray-100 pb-2">
              <span className="material-symbols-outlined text-[20px]">person</span>
              <h2>Personal Details</h2>
            </div>

            {/* Input: Full Name */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Full Name</label>
              <input 
                type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange}
                placeholder="Insert Full Name"
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              />
            </div>

            {/* Input: Username */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Username</label>
              <input 
                type="text" required name="username" value={formData.username} onChange={handleInputChange}
                placeholder="Insert Username"
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              />
              {usernameStatus.message && (
                <span className={`text-[12px] block ml-1 font-medium ${usernameStatus.available ? 'text-green-600' : 'text-red-500'}`}>
                  {usernameStatus.message}
                </span>
              )}
            </div>

            {/* Input: Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Password</label>
              <input 
                type="password" required name="password" value={formData.password} onChange={handleInputChange}
                placeholder="Create secure password"
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              />
              
              {/* Indikator Checklist Kriteria Password */}
              {formData.password.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl text-[12px] space-y-1 mt-1 border border-gray-100">
                  <p className={passwordErrors.length ? 'text-green-600' : 'text-gray-400'}>
                    {passwordErrors.length ? '✅' : '❌'} Minimal 8 karakter
                  </p>
                  <p className={passwordErrors.uppercase ? 'text-green-600' : 'text-gray-400'}>
                    {passwordErrors.uppercase ? '✅' : '❌'} Harus ada huruf besar (A-Z)
                  </p>
                  <p className={passwordErrors.lowercase ? 'text-green-600' : 'text-gray-400'}>
                    {passwordErrors.lowercase ? '✅' : '❌'} Harus ada huruf kecil (a-z)
                  </p>
                  <p className={passwordErrors.specialChar ? 'text-green-600' : 'text-gray-400'}>
                    {passwordErrors.specialChar ? '✅' : '❌'} Harus memiliki spesial karakter (!@#$*)
                  </p>
                </div>
              )}
            </div>

            {/* Input: Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Confirm Password</label>
              <input 
                type="password" required name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                placeholder="Re-type your password"
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              />
              {formData.confirmPassword.length > 0 && (
                <span className={`text-[12px] block ml-1 font-medium ${passwordErrors.match ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordErrors.match ? '✅ Password cocok' : '❌ Password belum sesuai'}
                </span>
              )}
            </div>

            {/* Input: Date of Birth */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Date of Birth</label>
              <input 
                type="date" required name="birthDate" value={formData.birthDate} onChange={handleInputChange}
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              />
            </div>

            {/* Input: Full Address */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Full Address</label>
              <textarea 
                rows="3" required name="fullAddress" value={formData.fullAddress} onChange={handleInputChange}
                placeholder="Insert Full Address"
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              />
            </div>

            {/* Input: Gender */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Gender</label>
              <div className="w-full bg-[#f1f4f5] p-1 rounded-xl flex">
                <button 
                  type="button" onClick={() => setFormData(p => ({...p, gender: 'Male'}))}
                  className={`flex-1 py-2 text-[14px] font-semibold rounded-lg transition-all ${formData.gender === 'Male' ? 'bg-white text-[#4b6700] shadow-sm' : 'text-gray-400'}`}
                >
                  Male
                </button>
                <button 
                  type="button" onClick={() => setFormData(p => ({...p, gender: 'Female'}))}
                  className={`flex-1 py-2 text-[14px] font-semibold rounded-lg transition-all ${formData.gender === 'Female' ? 'bg-white text-[#4b6700] shadow-sm' : 'text-gray-400'}`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Input: Job Type */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">Job Type</label>
              <select 
                required name="jobTypeId" value={formData.jobTypeId} onChange={handleInputChange}
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              >
                <option value="">Select Job Type</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.job_name}</option>
                ))}
              </select>
            </div>

            {/* Input: ID Number */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#434843]">ID Number (16 digit)</label>
              <input 
                type="number" required name="idNumber" value={formData.idNumber} onChange={handleInputChange}
                placeholder="Insert ID Number"
                className="w-full bg-[#f1f4f5] border-none rounded-xl py-3.5 px-4 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#b6f309]"
              />
              {idError && <span className="text-[12px] text-red-500 font-medium block ml-1">{idError}</span>}
            </div>

            {/* Section: Identity Verification */}
            <div className="flex items-center gap-2 text-[#061b0e] font-bold text-[16px] border-b border-gray-100 pt-2 pb-2">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <h2>Identity Verification</h2>
            </div>

            {/* Camera Capture Box 1: ID Photo */}
            <div className="space-y-2">
              <button 
                type="button" disabled={formData.idNumber.length !== 16} onClick={() => openCamera('ktp')}
                className={`w-full border-2 border-dashed border-gray-200 bg-[#f8faf9] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-all ${formData.idNumber.length !== 16 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {photoKtp ? (
                  <img src={photoKtp} alt="KTP Preview" className="h-32 object-contain rounded-lg" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[32px] text-gray-400">credit_card</span>
                    <span className="text-[14px] font-bold text-gray-700">ID Photo</span>
                    <span className="text-[11px] text-gray-400">Clear image, all corners visible</span>
                  </>
                )}
              </button>
            </div>

            {/* Camera Capture Box 2: Selfie with ID */}
            <div className="space-y-2">
              <button 
                type="button" disabled={formData.idNumber.length !== 16} onClick={() => openCamera('selfie')}
                className={`w-full border-2 border-dashed border-gray-200 bg-[#f8faf9] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-all ${formData.idNumber.length !== 16 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {photoSelfie ? (
                  <img src={photoSelfie} alt="Selfie Preview" className="h-32 object-contain rounded-lg" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[32px] text-gray-400">account_box</span>
                    <span className="text-[14px] font-bold text-gray-700">Selfie with ID</span>
                    <span className="text-[11px] text-gray-400">Ensure face and ID are clearly legible</span>
                  </>
                )}
              </button>
            </div>

            {/* Safe Guard Info */}
            <div className="bg-[#f6fce7] rounded-xl p-4 flex gap-3 border border-[#b6f309]/30">
              <span className="material-symbols-outlined text-[#4b6700] text-[20px] mt-0.5">info</span>
              <p className="text-[11px] text-[#434843] leading-relaxed">
                Verification data is processed securely and encrypted. Most reviews are completed within 24 hours to ensure the safety of the Wilder community.
              </p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#b6f309] text-[#061b0e] py-4 rounded-full text-[15px] font-bold shadow-md hover:bg-[#a1d800] active:scale-95 transition-all"
            >
              Submit
            </button>

            {/* Footer Text */}
            <div className="text-center text-[13px] text-gray-500 pt-2">
              Already have an account? <Link href="/login" className="text-[#4b6700] font-bold hover:underline">Log in</Link>
            </div>
          </form>
        </div>

        {/* Legal Footer */}
        <p className="text-[11px] text-gray-400 text-center max-w-[350px] mt-6 leading-relaxed">
          By signing up, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>

        {/* Camera Modal Overlay */}
        {activeCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-between p-6">
            <div className="w-full flex justify-end">
              <button onClick={closeCamera} className="text-white p-2">
                <span className="material-symbols-outlined text-[28px]">close</span>
              </button>
            </div>
            <div className="relative w-full max-w-[400px] aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden shadow-inner">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {activeCamera === 'ktp' && (
                <div className="absolute inset-8 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                  <p className="text-white/40 text-[12px]">Posisikan KTP di dalam kotak ini</p>
                </div>
              )}
            </div>
            <div className="pb-8">
              <button type="button" onClick={capturePhoto} className="w-16 h-16 bg-white rounded-full border-4 border-neutral-400 active:scale-90 transition-transform flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full border border-neutral-900" />
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}