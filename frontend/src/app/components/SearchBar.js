"use client";

import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search by name..."
      className="search-input"
    />
  );
}
