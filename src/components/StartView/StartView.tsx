import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartView.scss';

/**
 * StartView component - The initial view of the journey planner
 * Displays a welcome message and a button to start planning the journey
 */
const StartView: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/journey-entry');
  };

  return (
    <div className="start-view">
      <div className="start-view__content">
        <h1>Journey Planner</h1>
        <p>Plan your journey across the UK with ease</p>
        <button
          className="start-view__button"
          onClick={handleStart}
          aria-label="Start Journey Planning"
        >
          Start Journey
        </button>
      </div>
    </div>
  );
};

export default StartView;