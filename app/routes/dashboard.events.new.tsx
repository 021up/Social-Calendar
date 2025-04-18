import { Form, useNavigate, useActionData } from "@remix-run/react";
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/utils/supabase.server";
import { requireAuth } from "~/utils/supabase.server";
import { useAuth } from "~/context/auth.context";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Create New Event - Social Calendar" }];
};

export async function action({ request }: ActionFunctionArgs) {
  // Require authentication
  const user = await requireAuth(request);
  
  const formData = await request.formData();
  const title = formData.get("title");
  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location");
  const description = formData.get("description");
  const type = formData.get("type");
  const visibility = formData.get("visibility");
  const showInCalendar = formData.get("showInCalendar") === "on";
  const recurring = formData.get("recurring") === "on";

  const errors: Record<string, string> = {};

  if (!title || typeof title !== "string") {
    errors.title = "Title is required";
  }

  if (!date || typeof date !== "string") {
    errors.date = "Date is required";
  }

  if (!time || typeof time !== "string") {
    errors.time = "Time is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  try {
    // Combine date and time to create start_time
    const startDateTime = new Date(`${date}T${time}`);
    
    // Set end_time to 1 hour after start_time by default
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    
    // Determine if event is public based on visibility
    const isPublic = visibility === "public";

    // Insert event into Supabase
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: title as string,
          description: description as string || null,
          location: location as string || null,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          created_by: user.id,
          is_public: isPublic,
          event_type: type as string || "social",
        },
      ])
      .select();

    if (error) {
      console.error("Error creating event:", error);
      return json({ errors: { form: error.message } });
    }

    return redirect("/dashboard/events");
  } catch (error) {
    console.error("Event creation error:", error);
    return json({ errors: { form: "An unexpected error occurred" } });
  }
}

export default function NewEvent() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const { user } = useAuth();

  const handleCancel = () => {
    navigate("/dashboard/events");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <Form method="post" className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter event title"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="time"
                  id="time"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter event location"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter event description"
                ></textarea>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="work">Work</option>
                  <option value="social">Social</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                Visibility
              </label>
              <div className="mt-1">
                <select
                  id="visibility"
                  name="visibility"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="private">Private</option>
                  <option value="friends">Friends</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="showInCalendar"
                    name="showInCalendar"
                    type="checkbox"
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    defaultChecked
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="showInCalendar" className="font-medium text-gray-700">
                    Show in calendar
                  </label>
                  <p className="text-gray-500">Display this event in your calendar view</p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="recurring"
                    name="recurring"
                    type="checkbox"
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="recurring" className="font-medium text-gray-700">
                    Recurring event
                  </label>
                  <p className="text-gray-500">This event repeats on a schedule</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Event
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
