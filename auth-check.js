
const SUPABASE_URL = 'https://naidbmtqwckrwxioibea.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VlMCQAHqYujmr9uqVSKoag_yOjrDH4Q';

if (!window.supabase) {
  throw new Error('Supabase library is not loaded. Check the script tag.');
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function checkAccess(requiredRole = null) {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
      alert('Please login first!');
      window.location.href = 'login.html';
      return false;
    }

    const user = data.user;

    if (requiredRole) {
      const { data: profile, error: profileError } =
        await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

      if (
        profileError ||
        !profile ||
        profile.role !== requiredRole
      ) {
        alert('Access denied!');
        window.location.href = 'index.html';
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Access check failed:', error);
    alert('Could not verify access. Please try again.');
    window.location.href = 'login.html';
    return false;
  }
}
