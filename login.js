(() => {
  'use strict';
  const form = document.getElementById('loginForm');
  const button = document.getElementById('loginButton');
  const message = document.getElementById('message');

  function showMessage(text, kind = '') {
    message.textContent = text;
    message.dataset.kind = kind;
  }

  function readableError(error) {
    const msg = String(error?.message || '').toLowerCase();
    if (msg.includes('invalid login credentials')) return 'Email or password is incorrect. Please try again.';
    if (msg.includes('email not confirmed')) return 'Please confirm your email using the link we sent you, then log in.';
    if (msg.includes('rate limit') || msg.includes('too many requests')) return 'Too many attempts. Please wait a little and try again.';
    if (msg.includes('failed to fetch') || msg.includes('network')) return 'Could not connect. Check your internet connection and try again.';
    return error?.message || 'Login failed. Please try again.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.VYPEXO_SUPABASE) {
      showMessage('Authentication service did not load. Refresh the page and try again.', 'error');
      return;
    }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    button.disabled = true;
    showMessage('Logging you in…');

    try {
      const client = window.VYPEXO_SUPABASE;
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Login could not be verified.');

      // A missing profile is treated as a buyer. Never grant privileged roles in the browser.
      const { data: profile, error: profileError } = await client
        .from('profiles').select('role').eq('id', data.user.id).maybeSingle();
      if (profileError) {
        console.error('Profile lookup failed:', profileError);
        await client.auth.signOut();
        throw new Error('We could not verify your account permissions. Check the profiles table and its RLS policies.');
      }

      const role = profile?.role === 'admin' || profile?.role === 'seller' ? profile.role : 'buyer';
      const destinations = { admin: 'admin.html', seller: 'seller-dashboard.html', buyer: 'index.html' };
      window.location.replace(new URL(destinations[role], window.location.href).href);
    } catch (error) {
      console.error('Login error:', error);
      showMessage(readableError(error), 'error');
    } finally {
      button.disabled = false;
    }
  });
})();
