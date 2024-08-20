import React from "react";
import Login from "../components/Login";
import AppNavBar from "../components/AppNavBar";
import backgroundImage from "../assets/padelwide.jpg";
import AppFoot from "../components/AppFoot";

export default function LoginPage() {
  return (
    <div>
      <AppNavBar onLogin={true} />
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Login />
      </div>
      <AppFoot />
    </div>
  );
}
