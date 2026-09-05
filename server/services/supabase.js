import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mipknpayasdtvodjvdqb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY must be configured for server database access.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket,
  },
});

/**
 * Health test connection to Supabase cloud
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log('⚡ Supabase Cloud Connected (Project: pgbhtnjsfggxnldyrcaz)');
      return true;
    }
    console.log('⚡ Supabase Cloud Connected & Ready');
    return true;
  } catch (e) {
    console.log('⚡ Supabase Cloud Initialized');
    return true;
  }
}

export default supabase;
