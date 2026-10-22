/* Shared Supabase client for VYPEXO.
 * The publishable/anon key is intended for browser use. Protect data with
 * Supabase Row Level Security (RLS); never put a service-role key here.
 */
(() => {
  'use strict';

  const SUPABASE_URL = 'https://naidbmtqwckrwxioibea.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_VlMCQAHqYujmr9uqVSKoag_yOjrDH4Q';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase JS SDK failed to load.');
    return;
  }

  // Avoid creating multiple clients when this script is loaded more than once.
  window.VYPEXO_SUPABASE = window.VYPEXO_SUPABASE ||
    window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
})();
