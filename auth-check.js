const SUPABASE_URL = 'https://naidbmtqwckrwxioibea.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VlMCQAHqYujmr9uqVSKoag_yOjrDH4Q';

if (!window.supabase) {
  throw new Error('Supabase library is not loaded.');
}

window.VYPEXO_SUPABASE =
  window.VYPEXO_SUPABASE ||
  window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAccess(requiredRole = null) {
  const client = window.VYPEXO_SUPABASE;

  try {
    const { data, error } = await client.auth.getUser();

    if (error || !data.user) {
      window.location.href = 'login.html';
      return false;
    }

    if (requiredRole) {
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError || !profile || profile.role !== requiredRole) {
        alert('Access denied.');
        window.location.href = 'index.html';
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Access check failed:', error);
    alert('Could not verify your account. Please try again.');
    window.location.href = 'login.html';
    return false;
  }
}
