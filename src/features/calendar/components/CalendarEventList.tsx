
import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarEvent } from "../types";
import { StudySession } from "../types";
import CalendarEventItem from "./CalendarEventItem";

interface CalendarEventListProps {
  date: Date;
  events: CalendarEvent[];
  sessions?: StudySession[];
  onEditSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ 
  date, 
  events,
  sessions = [],
  onEditSession,
  onDeleteSession
}) => {
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return timeA - timeB;
  });

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">
          Events for {format(date, 'MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvents.length > 0 ? (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <CalendarEventItem 
                key={event.id} 
                event={event} 
                sessions={sessions}
                onEditSession={onEditSession}
                onDeleteSession={onDeleteSession}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No events scheduled for this date
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarEventList;
