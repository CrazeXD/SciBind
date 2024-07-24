'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventSelector = () => {
    // TODO: Get full list of events programmatically later
    // TODO: Style the page
  const [events, setEvents] = useState([
    { id: 1, name: 'Optics' },
    { id: 2, name: 'Wind Power' },
    { id: 3, name: 'Dynamic Planet' },
    { id: 4, name: 'Anatomy' },
  ]);
  const [selectedEvents, setSelectedEvents] = useState<{ id: number; name: string; }[]>([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleEventSelect = (event: { id: number; name: string; }) => {
    setSelectedEvents((prev) => 
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/event-set', {
        events: selectedEvents.map(event => event.id)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response:', response.data);
      alert('Events submitted successfully!');
    } catch (error) {
      console.error('Error submitting events:', error);
      alert('Failed to submit events. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Selector</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {events.map((event) => (
          <div
            key={event.id}
            className={`btn ${selectedEvents.includes(event) ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleEventSelect(event)}
          >
            {event.name}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Selected Events:</h2>
        <ul className="list-disc list-inside">
          {selectedEvents.map((event) => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
      </div>

      <button className="btn btn-success" onClick={handleSubmit}>
        Submit Events
      </button>
    </div>
  );
};

export default EventSelector;