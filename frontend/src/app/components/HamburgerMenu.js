"use client";

import { useRouter } from 'next/navigation';

import { TiHome } from "react-icons/ti";
import { MdManageAccounts } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { GiTabletopPlayers} from 'react-icons/gi';
import { BsFillPeopleFill} from "react-icons/bs";

export default function HamburgerMenu({ menuOpen, toggleMenu }) {

  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/'); // Navigate to home page
  };

  const handleAdminsClick = () => {
    router.push('/admins'); // Navigate to admins page
  };

  const handlePlayersClick = () => {
    router.push('/players'); // Navigate to players page
  };

  const handleTeamsClick = () => {
    router.push('/teams'); // Navigate to teams page
  };

  return (
    <>
      <button
        className={`hamburger-button ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      >
        ☰
      </button>

      <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
        <a onClick={handleHomeClick} className="menu-item">
          <TiHome className="menu-icon" /> Home
        </a>
        <a onClick={handleAdminsClick} className="menu-item">
          <MdManageAccounts className="menu-icon" /> Manage Admins
        </a>
        <a onClick={handlePlayersClick} className="menu-item">
          <RiTeamFill className="menu-icon" /> Manage Players
        </a>
        <a onClick={handleTeamsClick} className="menu-item">
          <BsFillPeopleFill className="menu-icon" /> Match Teams
        </a>
        <a href="#" className="menu-item">
          <GiTabletopPlayers className="menu-icon" /> Manage Matches
        </a>

        <div className="menu-footer">
          &copy; Padel Website
        </div>
      </div>
    </>
  );
}
