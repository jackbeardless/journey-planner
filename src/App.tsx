import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartView from './components/StartView/StartView';
import JourneyEntryView from './components/JourneyEntryView/JourneyEntryView';
import ResultView from './components/ResultView/ResultView';
import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<StartView />} />
          <Route path="/journey-entry" element={<JourneyEntryView />} />
          <Route path="/result" element={<ResultView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
