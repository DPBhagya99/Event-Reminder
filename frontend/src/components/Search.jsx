import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  // function handleChange(event) {
  //   setSearchTerm(event.target.value);
  // }

  function handleChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value); // Call onSearch directly to update results on input change
}


  function handleSearch() {
    onSearch(searchTerm);
  }

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>
        <SearchIcon />
      </button>
    </div>
  );
}

export default Search;
