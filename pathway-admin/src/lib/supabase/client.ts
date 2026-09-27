import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = "https://dhfuflpfgmgfipchitpq.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZnVmbHBmZ21nZmlwY2hpdHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTgwMTIsImV4cCI6MjEwNjA5NDAxMn0.aUQtsiG6sSQtNBOYx84o4mvA6jcrrTlINymq4QkMrk0";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(url, key);
}
