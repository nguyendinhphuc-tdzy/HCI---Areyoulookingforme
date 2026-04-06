require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Nhớ cấu hình các giá trị này trong Render Environment Variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://xxxxxxxx.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
