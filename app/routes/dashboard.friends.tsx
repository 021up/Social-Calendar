import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Friends - Social Calendar" }];
};

// Mock data for friends
const MOCK_FRIENDS = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "sarahj",
    avatar: null,
    status: "online",
    events: 3
  },
  {
    id: 2,
    name: "Michael Chen",
    username: "mikechen",
    avatar: null,
    status: "offline",
    events: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    username: "emilyr",
    avatar: null,
    status: "online",
    events: 2
  },
  {
    id: 4,
    name: "David Kim",
    username: "davidk",
    avatar: null,
    status: "offline",
    events: 0
  }
];

// Mock data for friend requests
const MOCK_FRIEND_REQUESTS = [
  {
    id: 101,
    name: "Jessica Williams",
    username: "jessicaw",
    avatar: null
  },
  {
    id: 102,
    name: "Robert Taylor",
    username: "robertt",
    avatar: null
  }
];

export default function Friends() {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Friends</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
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

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("friends")}
              className={`${
                activeTab === "friends"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              My Friends
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`${
                activeTab === "requests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Friend Requests
              {MOCK_FRIEND_REQUESTS.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                  {MOCK_FRIEND_REQUESTS.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("find")}
              className={`${
                activeTab === "find"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Find Friends
            </button>
          </nav>
        </div>

        {activeTab === "friends" && (
          <ul className="divide-y divide-gray-200">
            {MOCK_FRIENDS.map((friend) => (
              <li key={friend.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {friend.avatar ? (
                        <img src={friend.avatar} alt={friend.name} className="h-12 w-12 rounded-full" />
                      ) : (
                        <span className="text-xl text-gray-600">{friend.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{friend.name}</div>
                        <div className={`ml-2 h-2 w-2 rounded-full ${friend.status === "online" ? "bg-green-400" : "bg-gray-300"}`}></div>
                      </div>
                      <div className="text-sm text-gray-500">@{friend.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {friend.events} upcoming {friend.events === 1 ? "event" : "events"}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Calendar
                    </button>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "requests" && (
          <ul className="divide-y divide-gray-200">
            {MOCK_FRIEND_REQUESTS.map((request) => (
              <li key={request.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {request.avatar ? (
                        <img src={request.avatar} alt={request.name} className="h-12 w-12 rounded-full" />
                      ) : (
                        <span className="text-xl text-gray-600">{request.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{request.name}</div>
                      <div className="text-sm text-gray-500">@{request.username}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Accept
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Decline
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {MOCK_FRIEND_REQUESTS.length === 0 && (
              <div className="px-4 py-12 text-center">
                <p className="text-gray-500">No pending friend requests</p>
              </div>
            )}
          </ul>
        )}

        {activeTab === "find" && (
          <div className="p-6">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Search for friends</h3>
              <p className="mt-1 text-sm text-gray-500">
                Use the search bar above to find friends by name or username
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
