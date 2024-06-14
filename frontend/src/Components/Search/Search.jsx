import React, { useState } from "react";
import "./Search.css";
import SearchIcon from '@mui/icons-material/Search';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <button type="submit" className="search-button">
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default Search;
