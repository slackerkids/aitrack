import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(''); // State for selected time
  const [events, setEvents] = useState<Record<string, { eventName: string; endTime: Date }[]>>({});
  const [eventName, setEventName] = useState<string>(''); // State for event name

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleAddEvent = () => {
    if (eventName.trim() && time.trim()) {
      const startTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      startTime.setHours(hours, minutes);

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1); // Event duration - 1 hour

      const eventDate = startTime.toLocaleDateString(); // Date in the default format
      setEvents((prevEvents) => ({
        ...prevEvents,
        [eventDate]: [...(prevEvents[eventDate] || []), { eventName: eventName.trim(), endTime }],
      }));

      setEventName(''); // Clear input field
      setTime(''); // Clear time field
    }
  };

  const isEventDay = (day: Date) => {
    return events[day.toLocaleDateString()]?.length > 0;
  };

  // Filter events for the selected date
  const selectedDateKey = date.toLocaleDateString();
  const filteredEvents = events[selectedDateKey] || [];

  // Function to format the date as "October 18th"
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options).replace(/(\d+)(?=(st|nd|rd|th))/g, (match) => `${match}${['', 'st', 'nd', 'rd', 'th'][match % 10] || 'th'}`);
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 max-w-full">
      <div className="flex-1">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileClassName={({ date }) => 
            isEventDay(date) ? 'bg-yellow-200' : undefined // Highlight days with events
          }
          className="w-full rounded-[15px] p-2" // Adjust the height as needed
        />
      </div>
      <div className="flex-1 mt-4 lg:mt-0 lg:ml-4">
        <h2 className="text-lg font-bold">Add an Event for {formatDate(date)}:</h2>
        <div className="flex mt-2">
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
            className="border p-2 rounded-l"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded-l"
          />
          <button
            onClick={handleAddEvent}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Add
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-bold">Events:</h2>
          <ul className="list-disc list-inside">
            {filteredEvents.length === 0 ? (
              <li>No events on this day.</li>
            ) : (
              filteredEvents.map((event, index) => (
                <li key={index}>
                  {event.eventName} ({event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
