import { Form } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Profile - Social Calendar" }];
};

export default function Profile() {
  // Mock user data
  const user = {
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "Software developer and hiking enthusiast",
    avatar: null,
    notificationSettings: {
      friendRequests: true,
      eventInvites: true,
      eventUpdates: true,
      eventReminders: true
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your profile information and settings.</p>
        </div>
        <div className="border-t border-gray-200">
          <Form method="post" className="divide-y divide-gray-200">
            <div className="px-4 py-6 sm:p-6">
              <div className="flex items-center space-x-5">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl">
                      {user.name.charAt(0)}
                    </div>
                    <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true"></span>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Change avatar
                  </button>
                  <p className="mt-1 text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-12 gap-6">
                <div className="col-span-12 sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={user.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      defaultValue={user.username}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                    />
                  </div>
                </div>

                <div className="col-span-12">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={user.email}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-12">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      defaultValue={user.bio}
                    ></textarea>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Brief description for your profile.</p>
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
                <p className="mt-1 text-sm text-gray-500">Manage how you receive notifications.</p>
              </div>
              <div className="mt-6">
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">By Email</legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="friendRequests"
                          name="friendRequests"
                          type="checkbox"
                          defaultChecked={user.notificationSettings.friendRequests}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="friendRequests" className="font-medium text-gray-700">
                          Friend requests
                        </label>
                        <p className="text-gray-500">Get notified when someone sends you a friend request.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="eventInvites"
                          name="eventInvites"
                          type="checkbox"
                          defaultChecked={user.notificationSettings.eventInvites}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="eventInvites" className="font-medium text-gray-700">
                          Event invites
                        </label>
                        <p className="text-gray-500">Get notified when you're invited to an event.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="eventUpdates"
                          name="eventUpdates"
                          type="checkbox"
                          defaultChecked={user.notificationSettings.eventUpdates}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="eventUpdates" className="font-medium text-gray-700">
                          Event updates
                        </label>
                        <p className="text-gray-500">Get notified when an event you're attending is updated.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="eventReminders"
                          name="eventReminders"
                          type="checkbox"
                          defaultChecked={user.notificationSettings.eventReminders}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="eventReminders" className="font-medium text-gray-700">
                          Event reminders
                        </label>
                        <p className="text-gray-500">Get reminders about upcoming events.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Password</h3>
                <p className="mt-1 text-sm text-gray-500">Update your password.</p>
              </div>
              <div className="mt-6 grid grid-cols-12 gap-6">
                <div className="col-span-12 sm:col-span-6">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
