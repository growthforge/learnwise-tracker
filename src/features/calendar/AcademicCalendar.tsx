
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
import { 
  CalendarIcon, 
  BookOpen, 
  CheckSquare, 
  ClipboardList,
  Filter,
  X
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Extend the Task interface to include properties needed for the calendar
interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'class' | 'deadline' | 'task' | 'completed' | 'session';
  courseId?: string;
  courseColor?: string;
  description?: string;
  duration?: number; // in minutes
}

interface AcademicCalendarProps {
  courses: Course[];
  tasks?: ExtendedTask[];
  showFilters?: boolean;
  className?: string;
}

const AcademicCalendar: React.FC<AcademicCalendarProps> = ({ 
  courses, 
  tasks = [], 
  showFilters = true,
  className
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewFilter, setViewFilter] = useState<string>("all");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(courses.map(c => c.id));
  const [eventTypeFilters, setEventTypeFilters] = useState<string[]>(["class", "task", "completed", "deadline", "session"]);
  
  // Toggle course selection in filters
  const toggleCourseFilter = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  // Toggle event type filter
  const toggleEventTypeFilter = (type: string) => {
    if (eventTypeFilters.includes(type)) {
      setEventTypeFilters(eventTypeFilters.filter(t => t !== type));
    } else {
      setEventTypeFilters([...eventTypeFilters, type]);
    }
  };
  
  // Generate calendar events
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
        
        // Set the class time
        if (course.nextClass.time) {
          const [hours, minutes] = course.nextClass.time.split(':').length > 1 
            ? course.nextClass.time.split(':')
            : course.nextClass.time.includes('AM') || course.nextClass.time.includes('PM')
              ? [course.nextClass.time.split(' ')[0], '00']
              : ['09', '00'];
              
          const isPM = course.nextClass.time.includes('PM');
          const hour = parseInt(hours) + (isPM && parseInt(hours) < 12 ? 12 : 0);
          
          nextClassDate.setHours(hour, parseInt(minutes) || 0);
        }
        
        // Add the class event
        events.push({
          id: `class-${course.id}-${nextClassDate.getTime()}`,
          title: `${course.name} Class`,
          date: nextClassDate,
          type: 'class',
          courseId: course.id,
          courseColor: course.color,
          description: `Professor: ${course.professor}`,
          duration: 90 // Default 90 minutes duration
        });
        
        // Add classes for the next 4 weeks
        for (let i = 1; i <= 4; i++) {
          const futureClassDate = new Date(nextClassDate);
          futureClassDate.setDate(futureClassDate.getDate() + (7 * i));
          
          events.push({
            id: `class-${course.id}-${futureClassDate.getTime()}`,
            title: `${course.name} Class`,
            date: futureClassDate,
            type: 'class',
            courseId: course.id,
            courseColor: course.color,
            description: `Professor: ${course.professor}`,
            duration: 90 // Default 90 minutes duration
          });
        }
      }
    });
    
    // Add task events
    tasks.forEach(task => {
      if (task.dueDate || task.due) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : new Date(task.due);
        
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          date: dueDate,
          type: task.completed ? 'completed' : 'task',
          courseId: task.course.id,
          courseColor: task.course.color,
          description: task.description || `Priority: ${task.priority}`,
          duration: task.estimatedTime ? task.estimatedTime * 60 : 30 // Convert hours to minutes
        });
      }
    });
    
    return events;
  };

  const events = generateEvents();
  
  // Apply filters to events
  const filteredEvents = events.filter(event => {
    // Filter by selected courses
    if (!selectedCourses.includes(event.courseId || '')) return false;
    
    // Filter by event type
    if (!eventTypeFilters.includes(event.type)) return false;
    
    // Additional filter by view mode
    if (viewFilter === "all") return true;
    if (viewFilter === "classes" && event.type === "class") return true;
    if (viewFilter === "tasks" && (event.type === "task" || event.type === "deadline")) return true;
    if (viewFilter === "completed" && event.type === "completed") return true;
    
    return false;
  });
  
  // Filter events based on the selected date
  const selectedDateEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const selectedDate = new Date(date);
    
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Custom render function for calendar days
  const renderDay = (day: Date, events: CalendarEvent[]) => {
    const dayEvents = filteredEvents.filter(event => {
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
            {dayEvents.length > 3 && (
              <div className="h-1 w-1 rounded-full bg-gray-400" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {showFilters && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Academic Calendar
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFilterDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Select value={viewFilter} onValueChange={setViewFilter}>
              <SelectTrigger className="w-[160px]">
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border pointer-events-auto"
              components={{
                DayContent: (props) => (
                  <>
                    {props.date.getDate()}
                    {renderDay(props.date, events)}
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
            </div>
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
                {selectedDateEvents.sort((a, b) => {
                  const timeA = new Date(a.date).getTime();
                  const timeB = new Date(b.date).getTime();
                  return timeA - timeB;
                }).map((event) => {
                  const EventIcon = 
                    event.type === 'class' ? BookOpen :
                    event.type === 'completed' ? CheckSquare : ClipboardList;
                    
                  return (
                    <div 
                      key={event.id}
                      className="flex items-start p-3 border rounded-md"
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
                          <div className="text-xs px-2 py-0.5 rounded-full bg-muted">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
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
      
      {/* Filters Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Calendar Filters</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2">Event Types</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-classes" 
                  checked={eventTypeFilters.includes('class')} 
                  onCheckedChange={() => toggleEventTypeFilter('class')}
                />
                <Label htmlFor="filter-classes" className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Classes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-tasks" 
                  checked={eventTypeFilters.includes('task')} 
                  onCheckedChange={() => toggleEventTypeFilter('task')}
                />
                <Label htmlFor="filter-tasks" className="flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4" /> Tasks
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-completed" 
                  checked={eventTypeFilters.includes('completed')} 
                  onCheckedChange={() => toggleEventTypeFilter('completed')}
                />
                <Label htmlFor="filter-completed" className="flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" /> Completed Tasks
                </Label>
              </div>
            </div>
          
            <Separator className="my-4" />
          
            <h3 className="text-sm font-medium mb-2">Courses</h3>
            <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2">
              {courses.map(course => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`filter-course-${course.id}`} 
                    checked={selectedCourses.includes(course.id)} 
                    onCheckedChange={() => toggleCourseFilter(course.id)}
                  />
                  <Label htmlFor={`filter-course-${course.id}`} className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full bg-${course.color}-500`}></div>
                    {course.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setSelectedCourses(courses.map(c => c.id));
              setEventTypeFilters(["class", "task", "completed", "deadline", "session"]);
            }}>
              Reset Filters
            </Button>
            <DialogClose asChild>
              <Button>Apply</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcademicCalendar;
