"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Event {
  id: number;
  name: string;
  division: string;
  materialtype: string;
}

const EventSelector = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/events/", {
          headers: { Authorization: `Token ${storedToken}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleEventSelect = (event: Event) => {
    setSelectedEvents((prev) =>
      prev.some((e) => e.id === event.id)
        ? prev.filter((e) => e.id !== event.id)
        : [...prev, event]
    );
  };

  const handleSelectAll = () => setSelectedEvents(events);
  const handleClearAll = () => setSelectedEvents([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/event-set/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          events: selectedEvents.map((event) => event.name),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit events");
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting events:", error);
    }
  };

  const groupedEvents = events.reduce((acc, event) => {
    (acc[event.division] = acc[event.division] || []).push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mt-10 mb-8 text-center text-secondary">
          Select Your Events
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-secondary">
            Selected Events: {selectedEvents.length} / {events.length}
          </p>
          <div>
            <button
              className="btn btn-secondary mr-2 hover:bg-accent hover:text-white"
              onClick={handleSelectAll}
            >
              Select All Events
            </button>
            <button
              className="btn btn-secondary hover:bg-accent hover:text-white"
              onClick={handleClearAll}
            >
              Clear All Selections
            </button>
          </div>
        </div>

        {Object.entries(groupedEvents).map(([division, divisionEvents]) => (
          <div key={division} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-accent">Div {division}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {divisionEvents.map((event) => (
                <button
                  key={event.id}
                  className={`btn no-animation btn-lg ${
                    selectedEvents.some((e) => e.id === event.id)
                      ? "bg-primary text-white"
                      : "btn-outline btn-secondary"
                  } transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-white`}
                  onClick={() => handleEventSelect(event)}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-accent">
            Selected Events:
          </h2>
          {selectedEvents.length > 0 ? (
            <ul className="space-y-2">
              {selectedEvents.map((event) => (
                <li key={event.id} className="flex items-center text-secondary">
                  <span className="text-success mr-2">✓</span>
                  {event.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondary opacity-70">
              No events selected yet.
            </p>
          )}
        </div>

        <div className="text-center">
          <button
            className="btn btn-primary btn-wide hover:bg-accent"
            onClick={handleSubmit}
            disabled={selectedEvents.length === 0}
          >
            Submit Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSelector;