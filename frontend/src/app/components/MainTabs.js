"use client";  // Ensures this component is treated as a client component

import { useState, useEffect } from 'react';
import { GiTabletopPlayers} from 'react-icons/gi';
import { BsFillPeopleFill, BsPersonFill  } from "react-icons/bs";

import SearchBar from './SearchBar';
import PlayersTable from './PlayersTable';
import MatchesTable from './MatchesTable';
import DrawsTable from './DrawsTable';

export default function MainTabs() {

  const [activeTab, setActiveTab] = useState('players');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab('players')}
          className={`tab-button ${activeTab === 'players' ? 'tab-button-active' : 'tab-button-inactive'}`}
        >
            <div className="horizontal-container">
                    Players
            </div>
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`tab-button ${activeTab === 'matches' ? 'tab-button-active' : 'tab-button-inactive'}`}
        >
          <div className="horizontal-container">
                    Previous Matches
            </div>
        </button>
        <button
          onClick={() => setActiveTab('draws')}
          className={`tab-button ${activeTab === 'draws' ? 'tab-button-active' : 'tab-button-inactive'}`}
        >
          <div className="horizontal-container">
                    Upcoming Matches
            </div>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'players' && (
          <div>
           <SearchBar className="search-bar" onSearch={handleSearch} />
           <PlayersTable searchTerm={searchTerm} />
          </div>
        )}
        {activeTab === 'matches' && (
          
            <div>
            <SearchBar className="search-bar" onSearch={handleSearch}/>
            <MatchesTable searchTerm={searchTerm} />
          </div>
          
        )}
        {activeTab === 'draws' && (
          <div>
          <SearchBar className="search-bar" onSearch={handleSearch}/>
          <DrawsTable searchTerm={searchTerm} />
        </div>
        )}
      </div>
    </div>
  );
}
