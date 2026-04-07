import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[Supabase] ⚠️  VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no definidas.\n' +
        '           Creá un archivo Frontend/.env con esas variables para activar Auth.'
    );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
