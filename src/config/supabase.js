import { createClient } from "@supabase/supabase-js";

// Конфигурация Supabase из переменных окружения
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Проверка наличия переменных окружения
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are not set");
}

// Создание клиента Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
