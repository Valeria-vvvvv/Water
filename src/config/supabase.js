import { createClient } from "@supabase/supabase-js";

// Конфигурация Supabase из переменных окружения
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Создание клиента Supabase только если переменные окружения установлены
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    // Тихая обработка ошибки инициализации
    supabase = null;
  }
}

export { supabase };
export default supabase;
