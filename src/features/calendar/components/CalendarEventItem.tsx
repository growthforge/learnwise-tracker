
import React from "react";
import { format } from "date-fns";
import { BookOpen, CheckSquare, Clock, ClipboardList, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "../types";
import { StudySession } from "../types";

interface CalendarEventItemProps {
  event: CalendarEvent;
  sessions?: StudySession[];
  onEditSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ 
  event, 
  sessions = [],
  onEditSession,
  onDeleteSession
}) => {
  const EventIcon = 
    event.type === 'class' ? BookOpen :
    event.type === 'completed' ? CheckSquare : 
    event.type === 'session' ? Clock : ClipboardList;
    
  const isSession = event.type === 'session';
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSession && onDeleteSession) {
      const session = sessions.find(s => `session-${s.id}` === event.id);
      if (session) {
        onDeleteSession(session.id);
      }
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSession && onEditSession) {
      const sessionId = event.id.replace('session-', '');
      onEditSession(sessionId);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-start p-3 border rounded-md",
        isSession && "hover:bg-accent/50 cursor-pointer"
      )}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: `var(--${event.courseColor || 'primary'}-500)`
      }}
    >
      <div className="mr-3 mt-0.5">
        <EventIcon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(event.date), 'h:mm a')} 
              {event.duration && ` • ${event.duration < 60 ? `${event.duration}m` : `${Math.floor(event.duration / 60)}h${event.duration % 60 ? ` ${event.duration % 60}m` : ''}`}`}
            </p>
          </div>
          <div className="flex items-center">
            <div className="text-xs px-2 py-0.5 rounded-full bg-muted">
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </div>
            
            {isSession && (
              <div className="flex ml-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleEdit}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {event.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarEventItem;
