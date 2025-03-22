
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalendarEvent } from "../types";
import CalendarDayView from "./CalendarDayView";

interface CalendarSidebarProps {
  date: Date;
  onDateSelect: (date: Date) => void;
  onAddSession: (date: Date) => void;
  events: CalendarEvent[];
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ 
  date, 
  onDateSelect, 
  onAddSession,
  events 
}) => {
  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && onDateSelect(newDate)}
          className="rounded-md border pointer-events-auto"
          components={{
            DayContent: (props) => (
              <>
                {props.date.getDate()}
                <CalendarDayView day={props.date} events={events} />
              </>
            ),
          }}
        />
        
        <div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Classes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <span>Tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span>Study Sessions</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={() => onAddSession(date)} 
            variant="outline" 
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Study Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
