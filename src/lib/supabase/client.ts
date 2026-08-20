import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

export function createClient() {
  const { url, anon } = getSupabaseEnv();
  return createBrowserClient(url, anon);
}
