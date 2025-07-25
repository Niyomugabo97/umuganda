import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztmnskvycmzsyzunqkgy.supabase.co'; // Hano ushyire URL yawe nyayo ya Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0bW5za3Z5Y216c3l6dW5xa2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjQ0NzMsImV4cCI6MjA2ODk0MDQ3M30.tjhz5Axou47CA5mDjeDNsiAM4H_lQolRiEKXp2S9bm0'; // Hano ushyire anon key ya Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
