import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartView.scss';

// Simple start view
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