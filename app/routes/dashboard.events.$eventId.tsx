import { useParams, Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Event Details - Social Calendar" }];
};

// Mock data for a single event
const MOCK_EVENT = {
  id: 2,
  title: "Lunch with Sarah",
  date: "2023-06-15",
  time: "12:30 PM",
  location: "Cafe Deluxe",
  description: "Catching up over lunch to discuss the new project and share updates about our teams. Sarah mentioned she might bring some documents to review.",
  visibility: "friends",
  type: "social",
  attendees: [
    { id: 1, name: "Sarah Johnson", status: "confirmed" },
    { id: 2, name: "You", status: "confirmed" },
    { id: 3, name: "Michael Chen", status: "maybe" }
  ],
  comments: [
    { id: 1, author: "Sarah Johnson", text: "Looking forward to it!", time: "2 days ago" },
    { id: 2, author: "You", text: "Me too! I'll bring those documents we discussed.", time: "1 day ago" }
  ]
};

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const eventId = params.eventId;

  // In a real app, we would fetch the event data based on the ID
  const event = MOCK_EVENT;

  const handleDelete = () => {
    // In a real app, we would delete the event
    navigate("/dashboard/events");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/dashboard/events"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Event Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/dashboard/events/${eventId}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{event.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                event.type === "work" ? "bg-indigo-100 text-indigo-800" :
                event.type === "social" ? "bg-green-100 text-green-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {event.type}
              </span>
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                event.visibility === "private" ? "bg-gray-100 text-gray-800" :
                event.visibility === "friends" ? "bg-blue-100 text-blue-800" :
                "bg-green-100 text-green-800"
              }`}>
                {event.visibility}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.location}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.description}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Attendees</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {event.attendees.map((attendee) => (
                    <li key={attendee.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">{attendee.name}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          attendee.status === "confirmed" ? "bg-green-100 text-green-800" :
                          attendee.status === "maybe" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {attendee.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Comments</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {event.comments.map((comment) => (
              <li key={comment.id} className="px-4 py-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600">{comment.author.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      {comment.time}
                    </p>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{comment.text}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-4 py-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">U</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <form>
                  <div>
                    <label htmlFor="comment" className="sr-only">Comment</label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={3}
                      className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Add a comment..."
                    ></textarea>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
