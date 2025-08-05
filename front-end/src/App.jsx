import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatContainer from './ChatContainer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
