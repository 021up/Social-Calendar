import { useState, useEffect } from "react";
import { Form, Link, useActionData, useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useAuth } from "~/context/auth.context";

// Server-side imports (only used in action/loader functions)
import { supabase, supabaseAdmin } from "~/utils/supabase.server";
import { setAuthCookie } from "~/utils/supabase.server";
// Client-side imports
import { supabase as supabaseClient } from "~/utils/supabase.client";

export const meta: MetaFunction = () => {
  return [{ title: "Sign Up - Social Calendar" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const fullName = formData.get("fullName");

  const errors: Record<string, string> = {};

  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    errors.email = "Email is invalid";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!username || typeof username !== "string") {
    errors.username = "Username is required";
  }

  if (!fullName || typeof fullName !== "string") {
    errors.fullName = "Full name is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  try {
    // Check if username already exists in profiles table
    try {
      const { data: existingUsers, error: queryError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username);

      if (queryError) {
        console.error("Username check error:", queryError);
        return json({ errors: { form: "Error checking username availability" } });
      }

      if (existingUsers && existingUsers.length > 0) {
        return json({ errors: { username: "Username already taken" } });
      }
    } catch (checkError) {
      console.error("Username availability check failed:", checkError);
      return json({ errors: { form: "Error checking username availability" } });
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("Detailed auth error (server-side):", {
        error,
        userData: { email, username },
        timestamp: new Date().toISOString()
      });
      // Provide more specific error messages based on error type
      if (error.message.includes("email")) {
        return json({ errors: { email: error.message } });
      } else if (error.message.includes("password")) {
        return json({ errors: { password: error.message } });
      } else if (error.message.includes("User already registered")) {
        return json({ errors: { email: "This email is already registered. Please use a different email or try logging in." } });
      } else {
        return json({ errors: { form: error.message } });
      }
    }

    if (!data.user) {
      console.error("Signup failed: No user data returned");
      return json({ errors: { form: "Failed to create user account. Please check your information and try again." } });
    }
    
    if (!data.session) {
      console.error("Signup failed: No session data returned");
      return json({ errors: { form: "Account created but session could not be established. Please try logging in." } });
    }

    // Create a profile record in the profiles table
    // Use supabaseAdmin with service role key to bypass RLS policies since the user isn't authenticated yet
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          username,
          full_name: fullName,
          email: email as string,
          created_at: new Date().toISOString(),
        },
      ]);
      // Using supabaseAdmin client which has the service role key to bypass RLS

    if (profileError) {
      // First check if this is an RLS error
      const isRLSError = profileError.message.includes('row-level security');
      
      // Get RLS policies for debugging
      const rlsPolicies = await supabaseAdmin.rpc('get_rls_policies', { table_name: 'profiles' });
      
      // Check if supabaseAdmin client is properly configured
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const isUsingServiceRole = supabaseAdmin['rest'].headers['apikey'] === serviceRoleKey;
      
      // Additional debug checks
      const isServiceRoleKeyValid = serviceRoleKey && serviceRoleKey.length > 30;
      const isAdminClientInitialized = !!supabaseAdmin && !!supabaseAdmin['rest'];
      const isAuthInitialized = !!data.user && !!data.session;
      
      console.error("Detailed profile creation error (server-side):", {
        error: profileError,
        errorDetails: {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint
        },
        userData: {
          id: data.user.id,
          username,
          full_name: fullName,
          email: email as string
        },
        rlsContext: {
          isRLSError,
          table: 'profiles',
          operation: 'insert',
          policies: rlsPolicies,
          isUsingServiceRole,
          serviceRoleKeyConfigured: !!serviceRoleKey,
          isServiceRoleKeyValid,
          isAdminClientInitialized
        },
        timestamp: new Date().toISOString(),
        supabaseClientType: "admin",
        environment: process.env.NODE_ENV,
        debugInfo: {
          authUser: data.user,
          authSession: data.session,
          supabaseAdminHeaders: supabaseAdmin['rest'].headers,
          isAuthInitialized,
          envVariables: {
            SUPABASE_URL: !!process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
            NODE_ENV: process.env.NODE_ENV
          }
        }
      });
      
      // Provide more specific error message based on error type
      let errorMessage = `Error creating user profile: ${profileError.message}`;
      if (isRLSError) {
        errorMessage = "Profile creation failed due to row-level security restrictions. This should not happen with admin client.";
      } else if (!isUsingServiceRole) {
        errorMessage = "Profile creation failed - admin client not using service role key properly.";
      }
      
      return json({ 
        errors: { 
          form: errorMessage,
          debug: process.env.NODE_ENV === 'development' ? {
            errorDetails: profileError.details,
            rlsPolicies,
            isUsingServiceRole,
            serviceRoleKeyConfigured: !!serviceRoleKey
          } : undefined
        } 
      });
    }

    // Create a response with the redirect
    const response = redirect("/dashboard");
    
    // Set the auth cookie
    return setAuthCookie(response, data.session.access_token);
  } catch (error) {
    console.error("Signup error:", error);
    // Provide more detailed error message if possible
    if (error instanceof Error) {
      return json({ errors: { form: `Registration error: ${error.message}` } });
    } else {
      return json({ errors: { form: "An unexpected error occurred during registration. Please try again later." } });
    }
  }
}

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSideError, setClientSideError] = useState<string | null>(null);
  
  // If user is already logged in and has a valid session, redirect to dashboard
  useEffect(() => {
    if (user && user.id) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  // Client-side signup handler for better UX
  const handleClientSideSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setClientSideError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const fullName = formData.get("fullName") as string;
    
    try {
      // First check if username already exists
      const { data: existingUsers, error: usernameCheckError } = await supabaseClient
        .from('profiles')
        .select('username')
        .eq('username', username);
        
      if (usernameCheckError) {
        setClientSideError(`Error checking username: ${usernameCheckError.message}`);
        return;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        setClientSideError("Username already taken");
        return;
      }
      
      // Sign up with Supabase Auth
      const { data: authData, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { username, full_name: fullName },
        },
      });
      
      if (error) {
        // Provide more specific error message based on error type
        if (error.message.includes("email")) {
          setClientSideError(`Email error: ${error.message}`);
        } else if (error.message.includes("password")) {
          setClientSideError(`Password error: ${error.message}`);
        } else if (error.message.includes("User already registered")) {
          setClientSideError("This email is already registered. Please use a different email or try logging in.");
        } else {
          console.error("Signup error:", error);
          setClientSideError(error.message);
        }
        return;
      }
      
      if (!authData.user) {
        setClientSideError("Failed to create user account. Please try again.");
        return;
      }
      
      // Create a profile record in the profiles table
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert([{
          id: authData.user.id,
          username,
          full_name: fullName,
          email,
          created_at: new Date().toISOString(),
        }]);
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        setClientSideError(`Error creating user profile: ${profileError.message}`);
        return;
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      setClientSideError(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(actionData?.errors?.form || clientSideError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {actionData?.errors?.form || clientSideError}
              </p>
            </div>
          )}
          <Form method="post" className="space-y-6" onSubmit={handleClientSideSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {actionData?.errors?.email && (
                  <p className="mt-2 text-sm text-red-600">{actionData.errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {actionData?.errors?.username && (
                  <p className="mt-2 text-sm text-red-600">{actionData.errors.username}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {actionData?.errors?.fullName && (
                  <p className="mt-2 text-sm text-red-600">{actionData.errors.fullName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {actionData?.errors?.password && (
                  <p className="mt-2 text-sm text-red-600">{actionData.errors.password}</p>
                )}
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        passwordStrength === 0 ? 'bg-gray-200' :
                        passwordStrength === 1 ? 'bg-red-500 w-1/4' :
                        passwordStrength === 2 ? 'bg-yellow-500 w-2/4' :
                        passwordStrength === 3 ? 'bg-primary-500 w-3/4' :
                        'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {passwordStrength === 0 ? '' :
                     passwordStrength === 1 ? 'Weak' :
                     passwordStrength === 2 ? 'Fair' :
                     passwordStrength === 3 ? 'Good' :
                     'Strong'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign up
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
