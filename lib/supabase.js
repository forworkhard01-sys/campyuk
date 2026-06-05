// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvipsqswoytutulibklw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aXBzcXN3b3l0dXR1bGlia2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjI4NzQsImV4cCI6MjA5NjE5ODg3NH0.zRzoMoRT-RqEBoh7zymGNSdCgRTPpDXwUv52gK7QZYQ'; // Pastikan string ini utuh

export const supabase = createClient(supabaseUrl, supabaseAnonKey);