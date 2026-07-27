import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = 'https://mwrtluebbiyrmjrqwhut.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnRsdWViYml5cm1qcnF3aHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzk3MjcsImV4cCI6MjEwMDY1NTcyN30.EV4I4bd00ecgiTutVkhj1CwdO0mHrTv0--sgwVv6Muo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const useSupabaseUser = () => {
  const user = ref(supabase.auth.getUser())
  return user
}
