"use client";

import { GiTennisBall } from 'react-icons/gi';
import { useRouter } from 'next/navigation';

export default function AppNavBar({onHome, onLogin}) {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login'); // Navigate to the login page
  };
  const handleHomeClick = () => {
    router.push('/'); // Navigate to the home page
  };

  return (
    <nav className="bg-[#003060] shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <GiTennisBall style={{ marginRight: "1rem", fontSize: "3em", color: "white" }} />
          <span className="text-4xl font-bold text-white">
            Padel Website
          </span>
        </div>
        {onHome && (<nav>
          <button onClick={handleLoginClick} className="navbar-button">
            Login
          </button>
        </nav>)}
        {onLogin && (<nav>
          <button onClick={handleHomeClick} className="navbar-button">
            Home
          </button>
        </nav>)}
        
      </div>
    </nav>
  );
}
