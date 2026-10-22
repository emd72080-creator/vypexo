(() => {
  'use strict';
  const form = document.getElementById('signupForm');
  const button = document.getElementById('signupButton');
  const message = document.getElementById('message');

  function showMessage(text, kind = '') {
    message.textContent = text;
    message.dataset.kind = kind;
  }

  function readableError(error) {
    const msg = String(error?.message || '').toLowerCase();
    if (msg.includes('already registered') || msg.includes('already exists')) return 'An account may already exist for this email. Try logging in or use another email.';
    if (msg.includes('password')) return 'Please use a stronger password that meets the minimum length requirement.';
    if (msg.includes('rate limit') || msg.includes('too many requests')) return 'Too many signup attempts. Please wait and try again.';
    if (msg.includes('failed to fetch') || msg.includes('network')) return 'Could not connect. Check your internet connection and try again.';
    return error?.message || 'Account creation failed. Please try again.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.VYPEXO_SUPABASE) {
      showMessage('Authentication service did not load. Refresh the page and try again.', 'error');
      return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const requestedRole = document.getElementById('role').value;

    if (!fullName || fullName.length > 100) {
      showMessage('Please enter a name between 1 and 100 characters.', 'error');
      return;
    }
    if (!['buyer', 'seller'].includes(requestedRole)) {
      showMessage('Please select a valid account type.', 'error');
      return;
    }

    button.disabled = true;
    showMessage('Creating your account…');

    try {
      const { data, error } = await window.VYPEXO_SUPABASE.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, requested_role: requestedRole },
          emailRedirectTo: new URL('login.html', window.location.href).href
        }
      });
      if (error) throw error;
      if (!data.user) throw new Error('The service did not return an account. Please try again.');

      if (data.session) {
        showMessage('Your account is ready. Taking you to login…', 'success');
        window.setTimeout(() => window.location.replace(new URL('login.html', window.location.href).href), 1200);
      } else {
        showMessage('Account created. Check your inbox (and spam folder) for the email confirmation link, then log in.', 'success');
        form.reset();
      }
    } catch (error) {
      console.error('Signup error:', error);
      showMessage(readableError(error), 'error');
    } finally {
      button.disabled = false;
    }
  });
})();
