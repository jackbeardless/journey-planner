import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JourneyEntryView.scss';

// Interface defining the structure of a postcode entry
interface PostcodeEntry {
  id: string;
  postcode: string;
}

// Main component for handling journey entry and postcode management
const JourneyEntryView: React.FC = () => {
  const navigate = useNavigate();
  // State management for form inputs and data
  const [postcode, setPostcode] = useState('');  // Current postcode input
  const [postcodes, setPostcodes] = useState<PostcodeEntry[]>([]);  // List of added postcodes
  const [error, setError] = useState('');  // Error message state
  const [travelMode, setTravelMode] = useState<'Driving' | 'Bicycling' | 'Walking'>('Driving');  // Selected travel mode

  // Regular expression for UK postcode validation
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

  // Validates if a given postcode matches UK format
  const validatePostcode = (code: string): boolean => {
    return postcodeRegex.test(code.trim());
  };

  // Handles adding a new postcode to the route
  const handleAddPostcode = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPostcode = postcode.trim().toUpperCase();

    // Validate postcode format
    if (!validatePostcode(trimmedPostcode)) {
      setError('Please enter a valid UK postcode');
      return;
    }

    // Check for duplicate postcodes
    if (postcodes.some(p => p.postcode === trimmedPostcode)) {
      setError('This postcode has already been added');
      return;
    }

    // Add new postcode to the list with unique ID
    setPostcodes([...postcodes, { id: Date.now().toString(), postcode: trimmedPostcode }]);
    setPostcode('');
    setError('');
  };

  // Removes a postcode from the route by its ID
  const handleRemovePostcode = (id: string) => {
    setPostcodes(postcodes.filter(p => p.id !== id));
  };

  // Handles reordering postcodes in the route
  const handleMovePostcode = (id: string, direction: 'up' | 'down') => {
    const index = postcodes.findIndex(p => p.id === id);
    // Prevent moving if at the start/end of the list
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === postcodes.length - 1)) return;

    // Swap postcodes to reorder
    const newPostcodes = [...postcodes];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newPostcodes[index], newPostcodes[newIndex]] = [newPostcodes[newIndex], newPostcodes[index]];
    setPostcodes(newPostcodes);
  };

  // Calculates the journey based on selected postcodes and travel mode
  const handleCalculateJourney = async () => {
    // Ensure at least two postcodes are provided
    if (postcodes.length < 2) {
      setError('Please add at least two postcodes to calculate a journey');
      return;
    }

    // Prepare route data for API request
    const route = encodeURIComponent(
      postcodes.map(p => p.postcode.toUpperCase()).join(',')
    );

    try {
      // Determine API base URL based on environment
      const API_BASE = process.env.NODE_ENV === 'development' ? '/api' : '';
      const API_URL = process.env.REACT_APP_API_URL || 'https://journeyplanner-api.example.com';
      
      // Make API request to calculate journey
      const response = await fetch(
        `${API_BASE}/Travel/JourneyPlan.aspx?Route=${route}&Format=Miles&TravelMode=${travelMode}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to calculate journey: ${response.statusText}`);
      }

      const data = await response.text();
      if (!data || data.trim() === '') {
        throw new Error('No journey data received');
      }
      
      // Navigate to results view with journey data
      navigate('/result', { state: { journeyData: data, postcodes: postcodes, travelMode: travelMode } });
    } catch (err) {
      console.error('Journey calculation error:', err);
      setError('Failed to calculate journey. Please try again.');
    }
  };

  return (
    <div className="journey-entry">
      <div className="journey-entry__container">
        <h2>Plan Your Journey</h2>
        
        {/* Postcode input form with validation */}
        <form onSubmit={handleAddPostcode} className="journey-entry__form">
          <div className="input-group">
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Enter UK Postcode"
              aria-label="Enter UK Postcode"
            />
            <button type="submit" aria-label="Add Postcode">Add</button>
          </div>
          {/* Display validation errors */}
          {error && <p className="error-message">{error}</p>}
        </form>

        {/* Route display and management section */}
        {postcodes.length > 0 && (
          <div className="journey-entry__postcodes">
            <h3>Your Route</h3>
            <div className="postcode-list">
              {postcodes.map((entry, index) => (
                <div key={entry.id} className="postcode-item">
                  <span className="postcode-number">{index + 1}</span>
                  <span className="postcode-text">{entry.postcode}</span>
                  {/* Postcode reordering and removal controls */}
                  <div className="postcode-actions">
                    <button
                      onClick={() => handleMovePostcode(entry.id, 'up')}
                      disabled={index === 0}
                      aria-label="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMovePostcode(entry.id, 'down')}
                      disabled={index === postcodes.length - 1}
                      aria-label="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemovePostcode(entry.id)}
                      className="remove-button"
                      aria-label="Remove Postcode"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Travel mode selection */}
            <div className="journey-entry__travel-mode">
              <h3>Travel Mode</h3>
              <div className="travel-mode-selector">
                {['Driving', 'Bicycling', 'Walking'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTravelMode(mode as 'Driving' | 'Bicycling' | 'Walking')}
                    className={`travel-mode-button ${travelMode === mode ? 'active' : ''}`}
                    aria-label={`Select ${mode} mode`}
                    aria-pressed={travelMode === mode}
                  >
                    {mode === 'Driving' && '🚗'}
                    {mode === 'Bicycling' && '🚲'}
                    {mode === 'Walking' && '🚶'}
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Journey calculation trigger */}
        <button
          className="calculate-button"
          onClick={handleCalculateJourney}
          disabled={postcodes.length < 2}
          aria-label="Calculate Journey"
        >
          Calculate Journey
        </button>
      </div>
    </div>
  );
};

export default JourneyEntryView;