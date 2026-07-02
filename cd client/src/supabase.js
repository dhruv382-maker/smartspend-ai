import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mcahxqsmqhulzjhmgorg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYWh4cXNtcWh1bHpqaG1nb3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MTQ5ODIsImV4cCI6MjA5NzQ5MDk4Mn0.mylKEsgcP1Ne7Ws-_8hCPpkpJNL473Rk-yE9H6kMxk8";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);