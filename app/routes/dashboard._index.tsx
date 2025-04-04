import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Calendar - Social Calendar" }];
};

// Mock data for calendar events
const MOCK_EVENTS = [
  { id: 1, title: "Team Meeting", date: "2023-06-15", time: "10:00 AM", type: "work" },
  { id: 2, title: "Lunch with Sarah", date: "2023-06-15", time: "12:30 PM", type: "social" },
  { id: 3, title: "Gym Session", date: "2023-06-16", time: "06:00 PM", type: "personal" },
  { id: 4, title: "Movie Night", date: "2023-06-17", time: "08:00 PM", type: "social" },
  { id: 5, title: "Doctor Appointment", date: "2023-06-20", time: "09:15 AM", type: "personal" },
];

// Generate calendar days for the current month
const generateCalendarDays = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ day: null, isToday: false });
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isToday: i === today.getDate(),
      events: MOCK_EVENTS.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && eventDate.getMonth() === month;
      })
    });
  }
  
  return days;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const calendarDays = generateCalendarDays();

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
        <div className="flex space-x-2">
          <Link
            to="/dashboard/events/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Event
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {DAY_NAMES.map((day) => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] bg-white p-2 ${
                day.isToday ? "bg-primary-50" : ""
              }`}
            >
              {day.day !== null && (
                <>
                  <div className={`text-sm font-medium ${
                    day.isToday ? "text-primary-600" : "text-gray-700"
                  }`}>
                    {day.day}
                  </div>
                  <div className="mt-1 space-y-1">
                    {day.events?.map((event) => (
                      <div
                        key={event.id}
                        className={`px-2 py-1 text-xs rounded truncate ${
                          event.type === "work" ? "bg-indigo-100 text-indigo-800" :
                          event.type === "social" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {event.time} - {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
