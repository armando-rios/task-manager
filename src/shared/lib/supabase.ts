import { createServerClient, createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/**
 * CLIENTE DE NAVEGADOR (Para React Islands)
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * CLIENTE DE SERVIDOR (Universal para Middleware, Actions y Pages)
 * Implementación robusta y compatible con todas las versiones de Astro/Supabase.
 */
export function getSupabaseServerClient(cookies: any) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key) {
        return cookies.get(key)?.value;
      },
      set(key, value, options) {
        // Astro maneja las opciones de cookies de forma nativa
        cookies.set(key, value, options);
      },
      remove(key, options) {
        cookies.delete(key, options);
      },
    },
  });
}
