import { createClient } from '@supabase/supabase-js';
import { redirect } from '@remix-run/node';

// Initialize the Supabase client with server-side environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key');
  console.error('Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Create a regular client with anonymous key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a service role client for admin operations that need to bypass RLS
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if service key is not available

// Create a session cookie handler
export async function getSession(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  // Parse the cookie header to get the session token
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return [name, decodeURIComponent(value)];
    })
  );
  
  const accessToken = cookies.supabase_auth_token;
  if (!accessToken) return null;
  
  // Verify the session with Supabase
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;
  
  return data.user;
}

// Require authentication for protected routes
export async function requireAuth(request: Request) {
  const user = await getSession(request);
  if (!user) {
    throw redirect('/login');
  }
  return user;
}

// Set session cookie
export async function setAuthCookie(response: Response, token: string) {
  response.headers.append(
    'Set-Cookie',
    `supabase_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
  return response;
}

// Clear session cookie
export function clearAuthCookie(response: Response) {
  response.headers.append(
    'Set-Cookie',
    'supabase_auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );
  return response;
}