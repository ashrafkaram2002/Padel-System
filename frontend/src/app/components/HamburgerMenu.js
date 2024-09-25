"use client";

import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path); // Navigate to the specified path
  };

  const isActive = (path) => pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className={`navbar-item ${isActive('/')}`} onClick={() => handleNavigation('/')}>
          Home
        </div>
        <div className={`navbar-item ${isActive('/admins')}`} onClick={() => handleNavigation('/admins')}>
          Manage Admins
        </div>
        <div className={`navbar-item ${isActive('/players')}`} onClick={() => handleNavigation('/players')}>
          Manage Players
        </div>
        <div className={`navbar-item ${isActive('/teams')}`} onClick={() => handleNavigation('/teams')}>
          Match Teams
        </div>
        <div className={`navbar-item ${isActive('/matches')}`} onClick={() => handleNavigation('/matches')}>
          Manage Draws
        </div>
        <div className={`navbar-item ${isActive('/scores')}`} onClick={() => handleNavigation('/scores')}>
          Update Scores
        </div>
      </div>
    </nav>
  );
}
