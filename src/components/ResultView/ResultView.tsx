import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultView.scss';

interface PostcodeEntry {
  id: string;
  postcode: string;
}

interface LocationState {
  journeyData: string;
  postcodes: PostcodeEntry[];
  travelMode: 'Driving' | 'Bicycling' | 'Walking';
}

interface JourneySegment {
  duration: number;
  distance: number;
  fromPostcode: string;
  toPostcode: string;
}

const ResultView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state?.journeyData || !state?.postcodes) {
    return (
      <div className="result-view result-view--error">
        <div className="result-view__content">
          <h2>Error</h2>
          <p>No journey data available. Please try again.</p>
          <button onClick={() => navigate('/')} className="result-view__button">
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const parseJourneyData = (): {
    segments: JourneySegment[];
    totalDistance: number;
    totalDuration: number;
  } => {
    const segments = state.journeyData.split(';').filter(Boolean);
    const journeySegments: JourneySegment[] = [];
    let totalDistance = 0;
    let totalDuration = 0;

    segments.forEach((segment, index) => {
      const [duration, distance] = segment.split(',').map(Number);
      const fromPostcode = state.postcodes[index].postcode;
      const toPostcode = state.postcodes[index + 1].postcode;

      journeySegments.push({
        duration,
        distance,
        fromPostcode,
        toPostcode
      });

      totalDistance += distance;
      totalDuration += duration;
    });

    return { segments: journeySegments, totalDistance, totalDuration };
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  const formatDistance = (miles: number): string => {
    return `${miles.toFixed(1)} miles`;
  };

  const { segments, totalDistance, totalDuration } = parseJourneyData();

  return (
    <div className="result-view">
      <div className="result-view__content">
        <h2>Journey Summary</h2>
        
        <div className="result-view__mode">
          <span className="mode-icon">
            {state.travelMode === 'Driving' && '🚗'}
            {state.travelMode === 'Bicycling' && '🚲'}
            {state.travelMode === 'Walking' && '🚶'}
          </span>
          <span className="mode-text">{state.travelMode} Route</span>
        </div>

        <div className="result-view__totals">
          <div className="total-item">
            <span className="total-label">Total Distance</span>
            <span className="total-value">{formatDistance(totalDistance)}</span>
          </div>
          <div className="total-item">
            <span className="total-label">Total Time</span>
            <span className="total-value">{formatDuration(totalDuration)}</span>
          </div>
        </div>

        <div className="result-view__segments">
          <h3>Journey Segments</h3>
          {segments.map((segment, index) => (
            <div key={index} className="segment">
              <div className="segment__route">
                <span className="segment__postcode">{segment.fromPostcode}</span>
                <span className="segment__arrow">→</span>
                <span className="segment__postcode">{segment.toPostcode}</span>
              </div>
              <div className="segment__details">
                <span className="segment__stat">
                  <i className="icon-distance">📍</i>
                  {formatDistance(segment.distance)}
                </span>
                <span className="segment__stat">
                  <i className="icon-time">⏱</i>
                  {formatDuration(segment.duration)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="result-view__button"
          aria-label="Start New Journey"
        >
          Start New Journey
        </button>
      </div>
    </div>
  );
};

export default ResultView;