"use client";

import { useState } from 'react';

export default function HamburgerMenu({ menuOpen, toggleMenu }) {
  return (
    <>
      <button
        className={`hamburger-button ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      >
        ☰
      </button>

      <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#" className="menu-item">Manage Admins</a>
        <a href="#" className="menu-item">Manage Players</a>
        <a href="#" className="menu-item">Match Teams</a>
        <a href="#" className="menu-item">Draw Matches</a>
        <a href="#" className="menu-item">Update Scores</a>

        <div className="menu-footer">
          &copy; Padel Website
        </div>
      </div>

      
    </>
  );
}
