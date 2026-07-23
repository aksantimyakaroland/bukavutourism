// Service-role client — NEVER ship to browser. Kept for future server-only admin escalation.
// Current migration uses RLS for all mutations client-side, so this is unused.
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { auth: { persistSession: false } }
  );
}
