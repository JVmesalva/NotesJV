import { createBrowserClient } from "@supabase/ssr"
import { type Database } from "@/lib/supabase/database.types"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"

const client = createBrowserClient<Database>(supabaseUrl, supabasePublishableKey)

export { client }
