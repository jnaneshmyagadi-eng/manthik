import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "./config";

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anon } = requireSupabaseEnv();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          );
        } catch {
          // Server Component — ignore
        }
      },
    },
  });
}
