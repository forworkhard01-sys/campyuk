// app/create_user/actions.js
import { supabase } from '@/lib/supabase';

// Helper untuk mengubah string Base64 dari kamera menjadi file asli (Blob) sebelum diupload
function base64ToBlob(base64Str) {
  const byteString = atob(base64Str.split(',')[1]);
  const mimeString = base64Str.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * Mengambil semua daftar jenis pekerjaan untuk dropdown
 */
export async function getJobTypes() {
  const { data, error } = await supabase
    .from('job_type')
    .select('id, job_name')
    .order('job_name', { ascending: true });
  
  if (error) throw new Error(error.message);
  return data;
}

/**
 * MEMERIKSA KETERSEDIAAN USERNAME (Ini fungsi yang error/hilang tadi)
 */
export async function checkUsernameAvailability(username) {
  const { data, error } = await supabase
    .from('user')
    .select('username')
    .eq('username', username.trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? false : true; // false jika username sudah dipakai, true jika tersedia
}

/**
 * Menyimpan data registrasi user baru dengan Supabase Storage (Aman dari limit 8191 bytes)
 */
export async function registerUser(userData) {
  try {
    let urlKtp = '';
    let urlSelfie = '';

    // 1. Upload Foto KTP jika ada ke Bucket 'foto'
    if (userData.foto_ktp) {
      const blobKtp = base64ToBlob(userData.foto_ktp);
      const fileName = `ktp_${userData.id_number}_${Date.now()}.jpg`;
      
      const { error: uploadErr } = await supabase.storage
        .from('foto') // <--- GANTI DI SINI (Sebelumnya 'id-cards')
        .upload(fileName, blobKtp, { contentType: 'image/jpeg' });
        
      if (uploadErr) throw uploadErr;
      urlKtp = supabase.storage.from('foto').getPublicUrl(fileName).data.publicUrl; // <--- GANTI DI SINI
    }

    // 2. Upload Foto Selfie jika ada ke Bucket 'foto'
    if (userData.foto_selfie_ktp) {
      const blobSelfie = base64ToBlob(userData.foto_selfie_ktp);
      const fileName = `selfie_${userData.id_number}_${Date.now()}.jpg`;
      
      const { error: uploadErr } = await supabase.storage
        .from('foto') // <--- GANTI DI SINI
        .upload(fileName, blobSelfie, { contentType: 'image/jpeg' });
        
      if (uploadErr) throw uploadErr;
      urlSelfie = supabase.storage.from('foto').getPublicUrl(fileName).data.publicUrl; // <--- GANTI DI SINI
    }

    // 3. Simpan data berupa teks URL pendek ke dalam tabel database user
    const { error } = await supabase.from('user').insert([
      {
        full_name: userData.full_name,
        username: userData.username,
        email: userData.email,
        birth_date: userData.birth_date,
        full_address: userData.full_address,
        gender: userData.gender,
        job_type_id: userData.job_type_id,
        id_number: userData.id_number,
        password: userData.password,
        foto_ktp: urlKtp,            
        foto_selfie_ktp: urlSelfie,  
      }
    ]);

    if (error) throw error;
    return true;

  } catch (err) {
    throw new Error(err.message);
  }
}