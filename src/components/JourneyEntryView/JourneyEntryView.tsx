import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JourneyEntryView.scss';

interface PostcodeEntry {
  id: string;
  postcode: string;
}

const JourneyEntryView: React.FC = () => {
  const navigate = useNavigate();
  const [postcode, setPostcode] = useState('');
  const [postcodes, setPostcodes] = useState<PostcodeEntry[]>([]);
  const [error, setError] = useState('');
  const [travelMode, setTravelMode] = useState<'Driving' | 'Bicycling' | 'Walking'>('Driving');

  // UK Postcode validation regex
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

  const validatePostcode = (code: string): boolean => {
    return postcodeRegex.test(code.trim());
  };

  const handleAddPostcode = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPostcode = postcode.trim().toUpperCase();

    if (!validatePostcode(trimmedPostcode)) {
      setError('Please enter a valid UK postcode');
      return;
    }

    if (postcodes.some(p => p.postcode === trimmedPostcode)) {
      setError('This postcode has already been added');
      return;
    }

    setPostcodes([...postcodes, { id: Date.now().toString(), postcode: trimmedPostcode }]);
    setPostcode('');
    setError('');
  };

  const handleRemovePostcode = (id: string) => {
    setPostcodes(postcodes.filter(p => p.id !== id));
  };

  const handleMovePostcode = (id: string, direction: 'up' | 'down') => {
    const index = postcodes.findIndex(p => p.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === postcodes.length - 1)) return;

    const newPostcodes = [...postcodes];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newPostcodes[index], newPostcodes[newIndex]] = [newPostcodes[newIndex], newPostcodes[index]];
    setPostcodes(newPostcodes);
  };

  const handleCalculateJourney = async () => {
    if (postcodes.length < 2) {
      setError('Please add at least two postcodes to calculate a journey');
      return;
    }

    const route = encodeURIComponent(
      postcodes.map(p => p.postcode.toUpperCase()).join(',')
    );

    try {
      const API_BASE = process.env.NODE_ENV === 'development' ? '/api' : '';
      const API_URL = process.env.REACT_APP_API_URL || 'https://journeyplanner-api.example.com';
      
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
          {error && <p className="error-message">{error}</p>}
        </form>

        {postcodes.length > 0 && (
          <div className="journey-entry__postcodes">
            <h3>Your Route</h3>
            <div className="postcode-list">
              {postcodes.map((entry, index) => (
                <div key={entry.id} className="postcode-item">
                  <span className="postcode-number">{index + 1}</span>
                  <span className="postcode-text">{entry.postcode}</span>
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