import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
const supabase_key = process.env.SUPABASE_KEY;
const supabase = createClient("https://muenrhsbneislbcuqcuq.supabase.co", supabase_key);
