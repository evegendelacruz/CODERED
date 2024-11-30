import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://gugabfdcamppydzgjult.supabase.co";
const SUPABASE_ANON_KEY = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Z2FiZmRjYW1wcHlkemdqdWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MDU4MzEsImV4cCI6MjA0ODI4MTgzMX0.ab-8xAWWUbFfB8BBVEHpexRtVR-t_XLiQfYb4-VX8mk`; // Use backticks for multiline strings

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })