import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { supabase as supabaseServer, supabaseAdmin } from '~/utils/supabase.server';
import { supabase as supabaseClient } from '~/utils/supabase.client';
import { useAuth } from '~/context/auth.context';

// This function runs on the server when the route is loaded
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const type = url.searchParams.get('type');
  
  if (!token || type !== 'signup') {
    return json({ success: false, error: 'Invalid verification link' });
  }
  
  try {
    // Verify the token on the server side
    const { data, error } = await supabaseServer.auth.verifyOtp({
      token_hash: token,
      type: 'signup',
    });
    
    if (error) {
      console.error('Verification error:', error);
      return json({ success: false, error: error.message });
    }
    
    if (!data.user) {
      return json({ success: false, error: 'User not found' });
    }
    
    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      const userData = data.user.user_metadata || {};
      
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: data.user.id,
          username: userData.username || '',
          full_name: userData.full_name || '',
          email: data.user.email || '',
          created_at: new Date().toISOString(),
        }]);
      
      if (profileError) {
        console.error('Profile creation error after verification:', profileError);
        return json({ 
          success: true, 
          profileCreated: false, 
          error: profileError.message,
          user: data.user
        });
      }
    }
    
    return json({ 
      success: true, 
      profileCreated: !existingProfile,
      user: data.user
    });
  } catch (error) {
    console.error('Verification processing error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (!token || type !== 'signup') {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    
    const verifyEmail = async () => {
      try {
        // Client-side verification
        const { data, error } = await supabaseClient.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });
        
        if (error) {
          console.error('Client verification error:', error);
          setStatus('error');
          setMessage(error.message);
          return;
        }
        
        if (!data.user) {
          setStatus('error');
          setMessage('User not found');
          return;
        }
        
        // Check if profile exists
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
        
        if (profileError && !profileError.message.includes('No rows found')) {
          console.error('Profile check error:', profileError);
        }
        
        // If profile doesn't exist, create it
        if (!profile) {
          const userData = data.user.user_metadata || {};
          
          const { error: insertError } = await supabaseClient
            .from('profiles')
            .insert([{
              id: data.user.id,
              username: userData.username || '',
              full_name: userData.full_name || '',
              email: data.user.email || '',
              created_at: new Date().toISOString(),
            }]);
          
          if (insertError) {
            console.error('Client profile creation error:', insertError);
            // Continue anyway, as the server-side handler might have succeeded
          }
        }
        
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Client verification processing error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };
    
    verifyEmail();
  }, [searchParams, navigate]);
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'verifying' && (
            <div className="text-center">
              <p className="text-gray-700">Verifying your email...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-2 text-green-600">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-2 text-red-600">{message}</p>
              <button
                onClick={() => navigate('/signup')}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}