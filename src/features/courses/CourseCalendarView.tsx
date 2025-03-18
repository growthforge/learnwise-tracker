
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BookOpen, CheckSquare, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Course } from "@/components/CourseCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Task } from "@/components/TaskList";

interface CourseCalendarViewProps {
  courses: Course[];
  tasks?: Task[];
}

// Sample data structure for events
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'class' | 'deadline' | 'task' | 'completed';
  courseId?: string;
  courseColor?: string;
}

const CourseCalendarView: React.FC<CourseCalendarViewProps> = ({ courses, tasks = [] }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewFilter, setViewFilter] = useState<string>("all");

  // Generate sample calendar events
  const generateEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    // Add class events for courses
    courses.forEach(course => {
      if (course.nextClass) {
        const today = new Date();
        const dayMap: Record<string, number> = {
          "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 0
        };
        
        // Create a date for the next class
        const dayOfWeek = dayMap[course.nextClass.day];
        const currentDay = today.getDay();
        const daysUntilClass = (dayOfWeek - currentDay + 7) % 7;
        const nextClassDate = new Date(today);
        nextClassDate.setDate(today.getDate() + daysUntilClass);
        
        // Add the class event
        events.push({
          id: `class-${course.id}`,
          title: `${course.name} Class`,
          date: nextClassDate,
          type: 'class',
          courseId: course.id,
          courseColor: course.color
        });
      }
    });
    
    // Add task events
    tasks.forEach(task => {
      if (task.dueDate) {
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          date: new Date(task.dueDate),
          type: task.completed ? 'completed' : 'task',
          courseId: task.courseId,
          courseColor: courses.find(c => c.id === task.courseId)?.color
        });
      }
    });
    
    return events;
  };

  const events = generateEvents();
  
  // Filter events based on the selected date and view filter
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const selectedDate = new Date(date);
    
    const sameDay = 
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear();
      
    if (!sameDay) return false;
    
    if (viewFilter === "all") return true;
    if (viewFilter === "classes" && event.type === "class") return true;
    if (viewFilter === "tasks" && (event.type === "task" || event.type === "deadline")) return true;
    if (viewFilter === "completed" && event.type === "completed") return true;
    
    return false;
  });

  // Custom render function for calendar days
  const renderDay = (day: Date, events: CalendarEvent[]) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
    
    return dayEvents.length > 0 ? (
      <div className="relative">
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="flex gap-0.5">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div 
                key={i}
                className={`h-1 w-1 rounded-full bg-${event.courseColor || 'primary'}-500`}
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="h-1 w-1 rounded-full bg-gray-400" />
            )}
          </div>
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Calendar View
        </h2>
        <Select value={viewFilter} onValueChange={setViewFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="classes">Classes Only</SelectItem>
            <SelectItem value="tasks">Tasks & Deadlines</SelectItem>
            <SelectItem value="completed">Completed Tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border pointer-events-auto"
              components={{
                DayContent: ({ day }) => (
                  <>
                    {day.getDate()}
                    {renderDay(day, events)}
                  </>
                ),
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Events for {format(date, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const EventIcon = 
                    event.type === 'class' ? BookOpen :
                    event.type === 'completed' ? CheckSquare : ClipboardList;
                    
                  return (
                    <div 
                      key={event.id}
                      className="flex items-center p-3 border rounded-md"
                      style={{
                        borderLeftWidth: '4px',
                        borderLeftColor: `var(--${event.courseColor || 'primary'}-500)`
                      }}
                    >
                      <div className="mr-3">
                        <EventIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No events scheduled for this date
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseCalendarView;
