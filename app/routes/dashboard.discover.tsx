import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Discover Events - Social Calendar" }];
};

// Mock data for public events
const MOCK_PUBLIC_EVENTS = [
  {
    id: 201,
    title: "Tech Conference 2023",
    date: "2023-07-15",
    time: "09:00 AM",
    location: "Convention Center",
    organizer: "Tech Community",
    attendees: 156,
    category: "technology",
    image: null
  },
  {
    id: 202,
    title: "Summer Music Festival",
    date: "2023-07-22",
    time: "04:00 PM",
    location: "Central Park",
    organizer: "City Events",
    attendees: 342,
    category: "music",
    image: null
  },
  {
    id: 203,
    title: "Charity Run",
    date: "2023-06-30",
    time: "07:00 AM",
    location: "Riverside Park",
    organizer: "Health Foundation",
    attendees: 89,
    category: "sports",
    image: null
  },
  {
    id: 204,
    title: "Art Exhibition Opening",
    date: "2023-07-08",
    time: "06:30 PM",
    location: "Modern Art Gallery",
    organizer: "Arts Council",
    attendees: 75,
    category: "arts",
    image: null
  },
  {
    id: 205,
    title: "Food & Wine Festival",
    date: "2023-07-29",
    time: "12:00 PM",
    location: "Downtown Plaza",
    organizer: "Culinary Association",
    attendees: 210,
    category: "food",
    image: null
  }
];

export default function Discover() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = MOCK_PUBLIC_EVENTS.filter(event => {
    if (selectedCategory !== "all" && event.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Discover Events</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setSelectedCategory("technology")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "technology"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Technology
          </button>
          <button
            onClick={() => setSelectedCategory("music")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "music"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Music
          </button>
          <button
            onClick={() => setSelectedCategory("sports")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "sports"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Sports
          </button>
          <button
            onClick={() => setSelectedCategory("arts")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "arts"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Arts
          </button>
          <button
            onClick={() => setSelectedCategory("food")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "food"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Food & Drink
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {event.image ? (
                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
              ) : (
                <div className="text-4xl">
                  {event.category === "technology" ? "💻" :
                   event.category === "music" ? "🎵" :
                   event.category === "sports" ? "🏃" :
                   event.category === "arts" ? "🎨" :
                   "🍽️"}
                </div>
              )}
            </div>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {event.location}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                {event.attendees} attending
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {event.category}
                </span>
              </div>
              <div className="mt-5 flex justify-between">
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  View Details
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Join Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
