"use client";

import { GiTennisBall } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import { useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import HamburgerMenu from './HamburgerMenu';

export default function AppNavBar({onHome, onLogin}) {

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    router.push('/login'); // Navigate to the login page
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8000/logout');
  
      if (response.status === 200) {
        console.log('Logout successful');
        Cookies.remove('jwt'); // Remove the token from cookies
        setIsAdminLoggedIn(false);
        router.push('/login'); // Redirect to the login page
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const handleHomeClick = () => {
    router.push('/'); // Navigate to the home page
  };

  return (
    <nav className="bg-[#003060] shadow-md py-2 relative z-10">
      <div className="container mx-auto flex items-center justify-between px-4">
        
        {/* Left side: Menu */}
        <div className="flex items-center">
          {isAdminLoggedIn && (
            <div className='horizontal-container'>
              <HamburgerMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
            </div>
          )}
        </div>
  
        
  
        {/* Right side: Login/Logout */}
        <div className="flex items-center">
          
          {isAdminLoggedIn && (
            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          )}
  
          {(onHome && !isAdminLoggedIn) && (
            <button onClick={handleLoginClick} className="navbar-button2">
              Login
            </button>
          )}
  
          {onLogin && (
            <button onClick={handleHomeClick} className="navbar-button2">
              Home
            </button>
          )}
        </div>
      </div>
    </nav>
  );
  
}
