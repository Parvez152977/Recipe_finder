import { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-section">
      <input
        type="text"
        className="search-input"
        placeholder="Search for recipes... (e.g., pizza, pasta, chicken)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
      <button 
        type="submit" 
        disabled={loading}
        style={{
          marginTop: '10px',
          padding: '12px 30px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Searching...' : '🔍 Search'}
      </button>
    </form>
  );
};

export default SearchBar;