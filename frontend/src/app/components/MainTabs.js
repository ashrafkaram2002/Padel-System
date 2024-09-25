"use client";  // Ensures this component is treated as a client component

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import SearchBar from './SearchBar';
import PlayersTable from './PlayersTable';
import MatchesTable from './MatchesTable';
import DrawsTable from './DrawsTable';

export default function MainTabs() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'players';

  const [activeTab, setActiveTab] = useState(tab);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(tab); // Sync state with the 'tab' query param
  }, [tab]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    router.push(`?tab=${tabName}`); // Update the URL with the selected tab
  };

  return (
    <div>
  <div className="tab-buttons flex space-x-4">
    <button
      onClick={() => navigateToTab('players')}
      className={`tab-button ${activeTab === 'players' ? 'tab-button-active' : 'tab-button-inactive'} transform transition-transform duration-200 hover:-translate-y-1`}
    >
      <div className="horizontal-container10">
        Players
      </div>
    </button>
    
    <button
      onClick={() => navigateToTab('matches')}
      className={`tab-button ${activeTab === 'matches' ? 'tab-button-active' : 'tab-button-inactive'} transform transition-transform duration-200 hover:-translate-y-1`}
    >
      <div className="horizontal-container10">
        Previous Matches
      </div>
    </button>
    
    <button
      onClick={() => navigateToTab('draws')}
      className={`tab-button ${activeTab === 'draws' ? 'tab-button-active' : 'tab-button-inactive'} transform transition-transform duration-200 hover:-translate-y-1`}
    >
      <div className="horizontal-container10">
        Upcoming Matches
      </div>
    </button>
  </div>


      <div className="tab-content">
        {activeTab === 'players' && (
          <div>
           <div style={{marginLeft:"4.5rem"}}><SearchBar className="search-bar"onSearch={handleSearch} /></div>
           <PlayersTable searchTerm={searchTerm} />
          </div>
        )}
        {activeTab === 'matches' && (
          
            <div>
            <div style={{marginLeft:"4.5rem"}}><SearchBar className="search-bar"onSearch={handleSearch} /></div>
            <MatchesTable searchTerm={searchTerm} />
          </div>
          
        )}
        {activeTab === 'draws' && (
          <div>
          <div style={{marginLeft:"4.5rem"}}><SearchBar className="search-bar"onSearch={handleSearch} /></div>
          <DrawsTable searchTerm={searchTerm} />
        </div>
        )}
      </div>
    </div>
  );
}
