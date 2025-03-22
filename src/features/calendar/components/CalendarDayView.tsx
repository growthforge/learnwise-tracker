
import React from "react";
import { CalendarEvent } from "../types";

interface CalendarDayViewProps {
  day: Date;
  events: CalendarEvent[];
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({ day, events }) => {
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === day.getDate() &&
      eventDate.getMonth() === day.getMonth() &&
      eventDate.getFullYear() === day.getFullYear()
    );
  });
  
  if (dayEvents.length === 0) return null;
  
  // Group events by type for the indicators
  const classEvents = dayEvents.filter(e => e.type === 'class');
  const taskEvents = dayEvents.filter(e => e.type === 'task');
  const completedEvents = dayEvents.filter(e => e.type === 'completed');
  const sessionEvents = dayEvents.filter(e => e.type === 'session');
  
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="flex gap-0.5">
          {classEvents.length > 0 && (
            <div className="h-1 w-1 rounded-full bg-blue-500" />
          )}
          {taskEvents.length > 0 && (
            <div className="h-1 w-1 rounded-full bg-amber-500" />
          )}
          {completedEvents.length > 0 && (
            <div className="h-1 w-1 rounded-full bg-green-500" />
          )}
          {sessionEvents.length > 0 && (
            <div className="h-1 w-1 rounded-full bg-purple-500" />
          )}
          {dayEvents.length > 4 && (
            <div className="h-1 w-1 rounded-full bg-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;
