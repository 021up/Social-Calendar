import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "My Events - Social Calendar" }];
};

// Mock data for events
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2023-06-15",
    time: "10:00 AM",
    location: "Conference Room A",
    description: "Weekly team sync to discuss project progress",
    visibility: "private",
    type: "work"
  },
  {
    id: 2,
    title: "Lunch with Sarah",
    date: "2023-06-15",
    time: "12:30 PM",
    location: "Cafe Deluxe",
    description: "Catching up over lunch",
    visibility: "friends",
    type: "social"
  },
  {
    id: 3,
    title: "Gym Session",
    date: "2023-06-16",
    time: "06:00 PM",
    location: "Fitness Center",
    description: "Weekly workout routine",
    visibility: "private",
    type: "personal"
  },
  {
    id: 4,
    title: "Movie Night",
    date: "2023-06-17",
    time: "08:00 PM",
    location: "Cinema City",
    description: "Watching the new Marvel movie with friends",
    visibility: "friends",
    type: "social"
  },
  {
    id: 5,
    title: "Tech Conference",
    date: "2023-06-25",
    time: "09:00 AM",
    location: "Convention Center",
    description: "Annual technology conference with workshops and networking",
    visibility: "public",
    type: "work"
  }
];

export default function EventsList() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Events</h1>
        <Link
          to="/dashboard/events/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Event
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {MOCK_EVENTS.map((event) => (
            <li key={event.id}>
              <Link to={`/dashboard/events/${event.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        event.type === "work" ? "bg-indigo-100" :
                        event.type === "social" ? "bg-green-100" :
                        "bg-yellow-100"
                      }`}>
                        <span className={`text-lg ${
                          event.type === "work" ? "text-indigo-800" :
                          event.type === "social" ? "text-green-800" :
                          "text-yellow-800"
                        }`}>
                          {event.type === "work" ? "🏢" :
                           event.type === "social" ? "🎉" :
                           "🏃"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 flex flex-col items-end">
                        <div className="text-sm text-gray-500">{event.location}</div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.visibility === "private" ? "bg-gray-100 text-gray-800" :
                            event.visibility === "friends" ? "bg-blue-100 text-blue-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {event.visibility}
                          </span>
                        </div>
                      </div>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
