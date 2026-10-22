/* Load supabase-client.js before this file. */
(() => {
  'use strict';

  async function checkAccess(requiredRole = null) {
    const client = window.VYPEXO_SUPABASE;
    if (!client) {
      console.error('Supabase client is not initialized. Load supabase-client.js first.');
      window.location.replace(new URL('login.html', window.location.href).href);
      return false;
    }

    try {
      const { data, error } = await client.auth.getUser();
      if (error || !data?.user) {
        window.location.replace(new URL('login.html', window.location.href).href);
        return false;
      }

      if (requiredRole) {
        const { data: profile, error: profileError } = await client
          .from('profiles').select('role').eq('id', data.user.id).maybeSingle();

        if (profileError) {
          console.error('Role lookup failed:', profileError);
          alert('We could not verify your permissions. Please try again.');
          window.location.replace(new URL('index.html', window.location.href).href);
          return false;
        }

        if (!profile || profile.role !== requiredRole) {
          alert('You do not have permission to view this page.');
          window.location.replace(new URL('index.html', window.location.href).href);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Access check failed:', error);
      alert('Could not verify your account. Please try again.');
      window.location.replace(new URL('login.html', window.location.href).href);
      return false;
    }
  }

  window.checkAccess = checkAccess;
})();
