import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Social Calendar" },
    { name: "description", content: "Manage your social events and connect with friends" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-primary-600 mb-6">Social Calendar</h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-10">
            Manage your personal events, discover friends' schedules, and share activities with your social circle.
          </p>
          
          <div className="flex gap-4 mb-12">
            <Link 
              to="/login" 
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            <FeatureCard 
              title="Manage Events" 
              description="Create, edit, and organize your personal and social events in one place."
              icon="📅"
            />
            <FeatureCard 
              title="Connect with Friends" 
              description="Add friends, see their public events, and coordinate schedules easily."
              icon="👥"
            />
            <FeatureCard 
              title="Discover Activities" 
              description="Find public events and activities that match your interests."
              icon="🔍"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
