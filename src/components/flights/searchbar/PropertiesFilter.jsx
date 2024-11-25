import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
  Grid,
  FormGroup,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Example JSON Data (you can fetch this from a file or API)
const filterData = {
  budget: { min: 50, max: 500 },
  deals: { label: 'Deals', filters: ['All deals'] },
  popular_filters: { label: 'Popular Filters', filters: ['Family Rooms', 'Free WiFi'] },
  meals: { label: 'Meals', filters: ['Breakfast Included', 'Half Board', 'Full Board'] },
  property_type: { label: 'Property Type', filters: ['Hotel', 'Apartment', 'Hostel'] },
  review_score: { label: 'Review Score', filters: ['Exceptional: 9+', 'Very Good: 8+', 'Good: 7+', 'Fair: 6+'] },
  property_rating: { label: 'Property Rating', filters: ['5 stars', '4 stars', '3 stars'] },
  neighborhood: { label: 'Neighborhood', filters: ['City Center', 'Suburbs', 'Near Airport'] },
};

const PropertiesFilter = () => {
  const [budget, setBudget] = useState([filterData.budget.min, filterData.budget.max]); // Budget State
  const [filters, setFilters] = useState({}); 

  const handleBudgetChange = (event, newValue) => {
    setBudget(newValue);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  // Dynamically render filter sections based on the JSON data
  const renderFilterSection = (sectionKey) => {
    const section = filterData[sectionKey];

    return (
      <Accordion key={sectionKey}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: '600' }}>{section.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {section.filters.map((filter, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={filters[filter] || false}
                    onChange={handleFilterChange}
                    name={filter}
                  />
                }
                label={filter}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div style={{ padding: '10px', width: '30%' }}>
      <Typography variant="h6" sx={{ fontWeight: '600', paddingY: 2 }}>
        Filter By:
      </Typography>

      {/* Budget Slider */}
      <Typography sx={{ fontSize: '16px', paddingY: 2 }}>Your budget (per night)</Typography>
      <Slider
        value={budget}
        sx={{ paddingY: 2 }}
        onChange={handleBudgetChange}
        valueLabelDisplay="auto"
        min={filterData.budget.min}
        max={filterData.budget.max}
      />
      <Typography>
        ARS {budget[0]} - ARS {budget[1]}
      </Typography>

      {/* Dynamically Render Filters */}
      {Object.keys(filterData).map((sectionKey) => {
        // Skip the budget section, as it's handled separately
        if (sectionKey === 'budget') return null;

        return renderFilterSection(sectionKey);
      })}
    </div>
  );
};

export default PropertiesFilter;
