"use client";

import { GiTennisBall } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import HamburgerMenu from './HamburgerMenu';

export default function AppNavBar({onHome, onLogin, adminOn}) {

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => {
    router.push('/login'); // Navigate to the login page
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/logout', {
        credentials: 'include', // Ensure cookies are included in the request
      });
  
      if (response.ok) {
        console.log('Logout successful');
        router.push('/login'); // Redirect to the login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleHomeClick = () => {
    router.push('/'); // Navigate to the home page
  };

  return (
    <nav className="bg-[#003060] shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <GiTennisBall style={{ marginRight: "1rem", fontSize: "3em", color: "#8bdf36" }} />
          <span className="text-4xl font-bold text-white">
            Padel Website
          </span>
        </div>
        <div className="flex items-center">
          {adminOn && (
            <HamburgerMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
          )}

          {onHome && (
            <button onClick={adminOn? handleLogout: handleLoginClick} className="navbar-button">
              {adminOn ? 'Logout' : 'Login'}
            </button>
          )}

          {onLogin && (
            <button onClick={handleHomeClick} className="navbar-button">
              Home
            </button>
          )}
        </div>
        
      </div>
    </nav>
  );
}
