"use client";

import { useRouter } from 'next/navigation';
import { TiHome } from "react-icons/ti";
import { MdManageAccounts } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { GiTabletopPlayers } from 'react-icons/gi';
import { BsFillPeopleFill } from "react-icons/bs";
import { TbScoreboard } from "react-icons/tb";

export default function Navbar() {
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

  const handleMatchesClick = () => {
    router.push('/matches'); // Navigate to matches page
  };

  const handleScoresClick = () => {
    router.push('/scores'); // Navigate to scores page
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-item" onClick={handleHomeClick}>
           Home
        </div>
        <div className="navbar-item" onClick={handleAdminsClick}>
           Manage Admins
        </div>
        <div className="navbar-item" onClick={handlePlayersClick}>
           Manage Players
        </div>
        <div className="navbar-item" onClick={handleTeamsClick}>
           Match Teams
        </div>
        <div className="navbar-item" onClick={handleMatchesClick}>
           Manage Matches
        </div>
        <div className="navbar-item" onClick={handleScoresClick}>
           Update Scores
        </div>
      </div>
    </nav>
  );
}
