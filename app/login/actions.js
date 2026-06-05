// app/login/actions.js
'use server';

import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function loginUser(username, password) {
  try {
    if (!username || !password) {
      throw new Error('Username dan password wajib diisi.');
    }

    // 1. Cari data user berdasarkan username
    const { data: user, error } = await supabase
      .from('user')
      .select('id, username, password')
      .eq('username', username.trim().toLowerCase())
      .maybeSingle();

    if (error) throw error;

    // Jika username tidak ditemukan
    if (!user) {
      throw new Error('Username atau password salah.');
    }

    // 2. Cocokkan password input dengan password hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Username atau password salah.');
    }

    // Login sukses, kembalikan data ringkas user (atau status sukses)
    return {
      success: true,
      userId: user.id,
      username: user.username
    };

  } catch (err) {
    throw new Error(err.message);
  }
}