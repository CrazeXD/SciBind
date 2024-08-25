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
  const [activeDivision, setActiveDivision] = useState<string>("");
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
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
    fetchData("/events/").then((fetchedEvents) => {
      setEvents(fetchedEvents);
      if (fetchedEvents.length > 0) {
        setActiveDivision(fetchedEvents[0].division);
      }
    });
    fetchData("/user-events/").then(setSelectedEvents);
  }, [fetchData]);

  const handleEventSelect = useCallback((event: Event) => {
    setSelectedEvents((prev) =>
      prev.some((e) => e.id === event.id) ? prev.filter((e) => e.id !== event.id) : [...prev, event]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedEvents((prev) =>
      prev.concat(events.filter((event) => event.division === activeDivision))
    );
  }, [events, activeDivision]);

  const handleClearAll = useCallback(() => {
    setSelectedEvents((prev) => prev.filter((event) => event.division !== activeDivision));
  }, [activeDivision]);

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

      if (!response.ok) {
        throw new Error("Failed to submit events");
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting events:", error);
    }
  };

  const groupedEvents: GroupedEvents = events.reduce((acc, event) => {
    (acc[event.division] = acc[event.division] || []).push(event);
    return acc;
  }, {} as GroupedEvents);

  const divisions = Object.keys(groupedEvents);

  // Filter the selected and total events based on the active division for counting purposes
  const filteredSelectedEvents = selectedEvents.filter(
    (event) => event.division === activeDivision
  );
  const filteredTotalEvents = groupedEvents[activeDivision]?.length || 0;

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mt-10 mb-8 text-center text-primary">
          Select Your Events
        </h1>

        <EventSelectionControls
          selectedCount={filteredSelectedEvents.length}
          totalCount={filteredTotalEvents}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <DivisionTabs
                  divisions={divisions}
                  activeDivision={activeDivision}
                  setActiveDivision={setActiveDivision}
                />
                <EventList
                  events={groupedEvents[activeDivision] || []}
                  selectedEvents={selectedEvents}
                  onEventSelect={handleEventSelect}
                  onEventHover={setHoveredEvent}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <EventDetailsSidebar hoveredEvent={hoveredEvent} />
            <SelectedEventsList selectedEvents={selectedEvents} />
          </div>
        </div>

        <SubmitButton onSubmit={handleSubmit} disabled={selectedEvents.length === 0} />
      </div>
    </div>
  );
};

const DivisionTabs: React.FC<{
  divisions: string[];
  activeDivision: string;
  setActiveDivision: (division: string) => void;
}> = ({ divisions, activeDivision, setActiveDivision }) => (
  <div className="tabs tabs-boxed mb-4">
    {divisions.map((division) => (
      <a
        key={division}
        className={`tab ${activeDivision === division ? "tab-active" : ""}`}
        onClick={() => setActiveDivision(division)}
      >
        Division {division}
      </a>
    ))}
  </div>
);

const EventSelectionControls: React.FC<{
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
}> = ({ selectedCount, totalCount, onSelectAll, onClearAll }) => (
  <div className="card bg-base-100 shadow-xl mb-8">
    <div className="card-body">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-secondary font-semibold">
          Selected Events: {selectedCount} / {totalCount}
        </p>
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={onSelectAll}>
            Select All
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClearAll}>
            Clear All
          </button>
        </div>
      </div>
    </div>
  </div>
);

const EventList: React.FC<{
  events: Event[];
  selectedEvents: Event[];
  onEventSelect: (event: Event) => void;
  onEventHover: (event: Event | null) => void;
}> = ({ events, selectedEvents, onEventSelect, onEventHover }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {events.map((event) => (
      <EventButton
        key={event.id}
        event={event}
        isSelected={selectedEvents.some((e) => e.id === event.id)}
        onSelect={() => onEventSelect(event)}
        onHover={onEventHover}
      />
    ))}
  </div>
);

const EventButton: React.FC<{
  event: Event;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (event: Event | null) => void;
}> = ({ event, isSelected, onSelect, onHover }) => (
  <button
    className={`btn btn-sm w-full ${
      isSelected ? "btn-primary" : "btn-outline btn-secondary"
    } transition-all duration-300 hover:scale-105`}
    onClick={onSelect}
    onMouseEnter={() => onHover(event)}
    onMouseLeave={() => onHover(null)}
  >
    {event.name}
  </button>
);

const EventDetailsSidebar: React.FC<{ hoveredEvent: Event | null }> = ({ hoveredEvent }) => {
  const [displayedEvent, setDisplayedEvent] = useState<Event | null>(hoveredEvent);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (hoveredEvent) {
      setDisplayedEvent(hoveredEvent);
    } else {
      timeoutId = setTimeout(() => {
        setDisplayedEvent(null);
      }, 200);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hoveredEvent]);

  return (
    <div className="card bg-base-100 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title text-accent mb-4">Event Details</h2>
        {displayedEvent ? (
          <div>
            <p>
              <strong>Name:</strong> {displayedEvent.name}
            </p>
            <p>
              <strong>Division:</strong> {displayedEvent.division}
            </p>
            <p>
              <strong>Material Type:</strong> {displayedEvent.materialtype}
            </p>
          </div>
        ) : (
          <p className="text-secondary opacity-70">Hover over an event to see details</p>
        )}
      </div>
    </div>
  );
};

const SelectedEventsList: React.FC<{ selectedEvents: Event[] }> = ({ selectedEvents }) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-accent mb-4">Selected Events</h2>
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
  </div>
);

const SubmitButton: React.FC<{
  onSubmit: () => void;
  disabled: boolean;
}> = ({ onSubmit, disabled }) => (
  <div className="text-center">
    <button className="btn btn-primary btn-wide" onClick={onSubmit} disabled={disabled}>
      Submit Events
    </button>
  </div>
);

export default EventSelector;
