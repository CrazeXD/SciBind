"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";

interface Event {
  id: number;
  name: string;
  division: string;
  materialtype: string;
}

type GroupedEvents = Record<string, Event[]>;

const API_BASE_URL = "http://127.0.0.1:8000/api";

const EventSelector: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  const fetchData = useCallback(async (endpoint: string) => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Token ${storedToken}` },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${endpoint}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchData("/events/").then(setEvents);
    fetchData("/user-events/").then(setSelectedEvents);
  }, [fetchData]);

  const handleEventSelect = useCallback((event: Event) => {
    setSelectedEvents((prev) =>
      prev.some((e) => e.id === event.id)
        ? prev.filter((e) => e.id !== event.id)
        : [...prev, event]
    );
  }, []);

  const handleSelectAll = useCallback(() => setSelectedEvents(events), [events]);
  const handleClearAll = useCallback(() => setSelectedEvents([]), []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/event-set/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          events: selectedEvents.map((event) => event.id),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit events");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting events:", error);
    }
  };

  const groupedEvents: GroupedEvents = events.reduce((acc, event) => {
    (acc[event.division] = acc[event.division] || []).push(event);
    return acc;
  }, {} as GroupedEvents);

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mt-10 mb-8 text-center text-secondary">
          Select Your Events
        </h1>

        <EventSelectionControls
          selectedCount={selectedEvents.length}
          totalCount={events.length}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />

        <EventList
          groupedEvents={groupedEvents}
          selectedEvents={selectedEvents}
          onEventSelect={handleEventSelect}
        />

        <SelectedEventsList selectedEvents={selectedEvents} />

        <SubmitButton
          onSubmit={handleSubmit}
          disabled={selectedEvents.length === 0}
        />
      </div>
    </div>
  );
};

const EventSelectionControls: React.FC<{
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
}> = ({ selectedCount, totalCount, onSelectAll, onClearAll }) => (
  <div className="mb-6 flex justify-between items-center">
    <p className="text-secondary">
      Selected Events: {selectedCount} / {totalCount}
    </p>
    <div>
      <button
        className="btn btn-secondary mr-2 hover:bg-accent hover:text-white"
        onClick={onSelectAll}
      >
        Select All Events
      </button>
      <button
        className="btn btn-secondary hover:bg-accent hover:text-white"
        onClick={onClearAll}
      >
        Clear All Selections
      </button>
    </div>
  </div>
);

const EventList: React.FC<{
  groupedEvents: GroupedEvents;
  selectedEvents: Event[];
  onEventSelect: (event: Event) => void;
}> = ({ groupedEvents, selectedEvents, onEventSelect }) => (
  <>
    {Object.entries(groupedEvents).map(([division, divisionEvents]) => (
      <div key={division} className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-accent">
          Div {division}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {divisionEvents.map((event) => (
            <EventButton
              key={event.id}
              event={event}
              isSelected={selectedEvents.some((e) => e.id === event.id)}
              onSelect={() => onEventSelect(event)}
            />
          ))}
        </div>
      </div>
    ))}
  </>
);

const EventButton: React.FC<{
  event: Event;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ event, isSelected, onSelect }) => (
  <button
    className={`btn no-animation btn-lg ${
      isSelected ? "bg-primary text-white" : "btn-outline btn-secondary"
    } transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-white`}
    onClick={onSelect}
  >
    {event.name}
  </button>
);

const SelectedEventsList: React.FC<{ selectedEvents: Event[] }> = ({
  selectedEvents,
}) => (
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
      <p className="text-secondary opacity-70">No events selected yet.</p>
    )}
  </div>
);

const SubmitButton: React.FC<{
  onSubmit: () => void;
  disabled: boolean;
}> = ({ onSubmit, disabled }) => (
  <div className="text-center">
    <button
      className="btn btn-primary btn-wide hover:bg-accent"
      onClick={onSubmit}
      disabled={disabled}
    >
      Submit Events
    </button>
  </div>
);

export default EventSelector;