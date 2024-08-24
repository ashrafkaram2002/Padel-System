import React from "react";
import AppNavBar from "../components/AppNavBar";
import backgroundImage from "../assets/padelcourt.jpg";
import AppFoot from "../components/AppFoot";

export default function HomePage() {
  return (
    <div>
      <AppNavBar onLogin={false} />
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Padel Score Tracker
        </h1>
        <p className="text-2xl text-center max-w-2xl animate-fade-in-slow">
          Keep track of your padel matches, whether you're playing solo or in
          pairs. View detailed statistics and track your progress.
        </p>
      </div>

      <AppFoot />
    </div>
  );
}
