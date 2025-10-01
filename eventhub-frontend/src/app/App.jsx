import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home.jsx';
import EventsList from '../pages/Events/List.jsx';
import EventDetail from '../pages/Events/Detail.jsx';
import Support from '../pages/Support.jsx';
import Login from '../pages/Auth/Login.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {<Route path="/events" element={<EventsList />} /> }
        {<Route path="/events/:id" element={<EventDetail />} /> }
        {<Route path="/support" element={<Support />} /> }
        {<Route path="/login" element={<Login />} /> }
      </Routes>
    </BrowserRouter>
  );
}
