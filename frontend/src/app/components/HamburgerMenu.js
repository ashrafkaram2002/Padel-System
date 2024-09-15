"use client";

export default function HamburgerMenu({ menuOpen, toggleMenu }) {
  return (
    <>
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰ 
      </button>

      {menuOpen && (
        <div className="hamburger-menu bg-white shadow-lg rounded p-4 absolute top-[4rem] right-0">
          <a href="#" className="block py-2">Dashboard</a>
          <a href="#" className="block py-2">Settings</a>
          <a href="#" className="block py-2">Profile</a>
          {/* Add more links as needed */}
        </div>
      )}
    </>
  );
}
