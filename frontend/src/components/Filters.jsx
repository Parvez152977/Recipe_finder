import 'react';
import './Filters.css';

const Filters = ({ filters, onFilterChange }) => {
  const diets = ['', 'vegetarian', 'vegan', 'gluten free', 'dairy free', 'keto'];
  const dietLabels = {
    '': 'All Diets',
    'vegetarian': '🥬 Vegetarian',
    'vegan': '🌱 Vegan',
    'gluten free': '🌾 Gluten Free',
    'dairy free': '🥛 Dairy Free',
    'keto': '🥑 Keto'
  };
  
  const maxTimes = ['', 15, 30, 45, 60, 90];
  const timeLabels = {
    '': 'Any Time',
    '15': '⏱️ Under 15 min',
    '30': '⏱️ Under 30 min',
    '45': '⏱️ Under 45 min',
    '60': '⏱️ Under 60 min',
    '90': '⏱️ Under 90 min'
  };

  const handleDietChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onFilterChange('diet', '');
    } else {
      onFilterChange('diet', value);
    }
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onFilterChange('maxReadyTime', null);
    } else {
      onFilterChange('maxReadyTime', parseInt(value));
    }
  };

  const handleClearFilters = () => {
    onFilterChange('reset');
  };

  const hasActiveFilters = filters.diet || filters.maxReadyTime;

  return (
    <div style={{
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '30px',
      padding: '15px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50px',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Diet Filter Dropdown */}
      <select
        value={filters.diet || ''}
        onChange={handleDietChange}
        style={{
          padding: '10px 20px',
          borderRadius: '25px',
          border: 'none',
          background: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        {diets.map(diet => (
          <option key={diet} value={diet}>
            {dietLabels[diet]}
          </option>
        ))}
      </select>

      {/* Max Ready Time Filter Dropdown */}
      <select
        value={filters.maxReadyTime || ''}
        onChange={handleTimeChange}
        style={{
          padding: '10px 20px',
          borderRadius: '25px',
          border: 'none',
          background: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        {maxTimes.map(time => (
          <option key={time} value={time}>
            {timeLabels[time] || (time && `Under ${time} min`)}
          </option>
        ))}
      </select>

      {/* Clear Filters Button (only shows if filters are active) */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          style={{
            padding: '10px 20px',
            borderRadius: '25px',
            border: 'none',
            background: '#ff6b6b',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          ✖ Clear Filters
        </button>
      )}
    </div>
  );
};

export default Filters;