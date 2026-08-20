import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./config";

export function createClient() {
  const { url, anon } = requireSupabaseEnv();
  return createBrowserClient(url, anon);
}
