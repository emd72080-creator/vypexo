const SUPABASE_URL = 'https://naidbmtqwckrwxioibea.supabase.coOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'sb_publishable_VlMCQAHqYujmr9uqVSKoag_yOjrDH4Q';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAccess(requiredRole = null) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  if (requiredRole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== requiredRole) {
      alert("Access denied!");
      window.location.href = "index.html";
    }
  }
}
