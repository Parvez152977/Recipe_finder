import React from 'react';

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

  const hasActiveFilters = (filters && (filters.diet || filters.maxReadyTime));

  return (
    <div className="filters-container">
      <select
        className="filter-select"
        value={filters?.diet || ''}
        onChange={(e) => onFilterChange('diet', e.target.value === '' ? '' : e.target.value)}
      >
        {diets.map(diet => (
          <option key={diet} value={diet}>
            {dietLabels[diet]}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters?.maxReadyTime || ''}
        onChange={(e) => onFilterChange('maxReadyTime', e.target.value === '' ? null : parseInt(e.target.value))}
      >
        {maxTimes.map(time => (
          <option key={time} value={time}>
            {timeLabels[time] || (time && `Under ${time} min`)}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          className="filter-clear"
          onClick={() => onFilterChange('reset')}
        >
          ✖ Clear Filters
        </button>
      )}
    </div>
  );
};

export default Filters;