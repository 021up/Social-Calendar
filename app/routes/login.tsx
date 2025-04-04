import { Form, Link, useActionData, useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/utils/supabase.server";
import { setAuthCookie } from "~/utils/supabase.server";
import { useAuth } from "~/context/auth.context";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Login - Social Calendar" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  const errors: Record<string, string> = {};

  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  try {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    });

    if (error) {
      return json({ errors: { form: error.message } });
    }

    if (!data.session) {
      return json({ errors: { form: "Failed to sign in" } });
    }

    // Create a response with the redirect
    const response = redirect("/dashboard");
    
    // Set the auth cookie
    return setAuthCookie(response, data.session.access_token);
  } catch (error) {
    console.error("Login error:", error);
    return json({ errors: { form: "An unexpected error occurred" } });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSideError, setClientSideError] = useState<string | null>(null);
  
  // If user is already logged in and has a valid session, redirect to dashboard
  useEffect(() => {
    if (user && user.id) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  // Client-side login handler for better UX
  const handleClientSideLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setClientSideError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setClientSideError(error.message);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setClientSideError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method="post" className="space-y-6" onSubmit={handleClientSideLogin}>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {actionData?.errors?.password && (
                  <p className="mt-2 text-sm text-red-600">{actionData.errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign in
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
