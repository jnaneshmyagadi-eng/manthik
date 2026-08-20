export function getSupabaseEnv(): { url: string; anon: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return { url, anon };
}

export function requireSupabaseEnv(): { url: string; anon: string } {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return env;
}

export function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}
