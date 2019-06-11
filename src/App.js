import React from 'react';
import './App.css';
import IssuesList from './IssuesList';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Issue Tracker</h1>
      </header>
      <IssuesList url={process.env.REACT_APP_API_URL + '/v1/issues'} />
    </div>
  );
}

export default App;
