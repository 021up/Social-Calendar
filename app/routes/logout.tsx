import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { supabase } from "~/utils/supabase.server";
import { clearAuthCookie } from "~/utils/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  // Sign out from Supabase
  await supabase.auth.signOut();
  
  // Create a response with the redirect
  const response = redirect("/");
  
  // Clear the auth cookie
  return clearAuthCookie(response);
}

export async function loader() {
  // If someone tries to access this route directly, redirect them to the home page
  return redirect("/");
}