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
  Plus,
  Clock,
  PencilLine,
  Trash2
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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Extend the Task interface to include properties needed for the calendar
interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

export interface StudySession {
  id: string;
  title: string;
  date: Date;
  courseId: string;
  courseColor?: string;
  description?: string;
  duration: number; // in minutes
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
  sessions?: StudySession[];
  onAddSession?: () => void;
  onEditSession?: (sessionId: string) => void; // Added this prop
  onDeleteSession?: (sessionId: string) => void;
  showFilters?: boolean;
  className?: string;
}

const AcademicCalendar: React.FC<AcademicCalendarProps> = ({ 
  courses, 
  tasks = [],
  sessions = [],
  onAddSession,
  onEditSession, // Add this prop
  onDeleteSession,
  showFilters = true,
  className
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewFilter, setViewFilter] = useState<string>("all");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(courses.map(c => c.id));
  const [eventTypeFilters, setEventTypeFilters] = useState<string[]>(["class", "task", "completed", "deadline", "session"]);
  
  // Session form state
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<StudySession | null>(null);
  const [newSessionDate, setNewSessionDate] = useState<Date | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<StudySession | null>(null);
  
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
  
  // Open session form for adding
  const handleAddSession = (date: Date) => {
    setNewSessionDate(date);
    setSessionToEdit(null);
    setIsSessionFormOpen(true);
  };
  
  // Open session form for editing
  const handleEditSession = (session: StudySession) => {
    setSessionToEdit(session);
    setNewSessionDate(null);
    setIsSessionFormOpen(true);
  };
  
  // Handle delete session confirmation
  const handleDeleteSession = (session: StudySession) => {
    setSessionToDelete(session);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm session deletion
  const confirmDeleteSession = () => {
    if (sessionToDelete && onDeleteSession) {
      onDeleteSession(sessionToDelete.id);
      toast.success("Study session deleted");
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };
  
  // Handle save session (add or update)
  const handleSaveSession = (sessionData: {
    title: string;
    courseId: string;
    description?: string;
    duration: number;
    date: Date;
  }) => {
    const course = courses.find(c => c.id === sessionData.courseId);
    
    if (!course) {
      toast.error("Please select a valid course");
      return;
    }
    
    if (sessionToEdit) {
      // Update existing session
      const updatedSession: StudySession = {
        ...sessionToEdit,
        ...sessionData,
        courseColor: course.color
      };
      
      if (onUpdateSession) {
        onUpdateSession(updatedSession);
        toast.success("Study session updated");
      }
    } else {
      // Create new session
      const newSession: StudySession = {
        id: `session-${Date.now()}`,
        ...sessionData,
        courseColor: course.color
      };
      
      if (onAddSession) {
        onAddSession(newSession);
        toast.success("Study session added");
      }
    }
    
    setIsSessionFormOpen(false);
    setSessionToEdit(null);
    setNewSessionDate(null);
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
    
    // Add study session events
    sessions.forEach(session => {
      events.push({
        id: `session-${session.id}`,
        title: session.title,
        date: new Date(session.date),
        type: 'session',
        courseId: session.courseId,
        courseColor: session.courseColor,
        description: session.description,
        duration: session.duration
      });
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
    if (viewFilter === "sessions" && event.type === "session") return true;
    
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
                <SelectItem value="sessions">Study Sessions</SelectItem>
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
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Study Sessions</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => handleAddSession(date)} 
                variant="outline" 
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Study Session
              </Button>
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
                    event.type === 'completed' ? CheckSquare : 
                    event.type === 'session' ? Clock : ClipboardList;
                    
                  const isSession = event.type === 'session';
                  
                  return (
                    <div 
                      key={event.id}
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const session = sessions.find(s => `session-${s.id}` === event.id);
                                    if (session) {
                                      const sessionId = event.id.replace('session-', '');
                                      if (onEditSession) onEditSession(sessionId);
                                    }
                                  }}
                                >
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const session = sessions.find(s => `session-${s.id}` === event.id);
                                    if (session) handleDeleteSession(session);
                                  }}
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
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-sessions" 
                  checked={eventTypeFilters.includes('session')} 
                  onCheckedChange={() => toggleEventTypeFilter('session')}
                />
                <Label htmlFor="filter-sessions" className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Study Sessions
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
      
      {/* Session Form Dialog */}
      <Dialog open={isSessionFormOpen} onOpenChange={(open) => !open && setIsSessionFormOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{sessionToEdit ? 'Edit Study Session' : 'Add Study Session'}</DialogTitle>
          </DialogHeader>
          <SessionForm 
            courses={courses}
            onSave={handleSaveSession}
            onCancel={() => setIsSessionFormOpen(false)}
            initialSession={sessionToEdit || undefined}
            initialDate={newSessionDate || undefined}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Study Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this study session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteSession}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Session Form Component
interface SessionFormProps {
  courses: Course[];
  initialSession?: StudySession;
  initialDate?: Date;
  onSave: (sessionData: {
    title: string;
    courseId: string;
    description?: string;
    duration: number;
    date: Date;
  }) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  courses,
  initialSession,
  initialDate,
  onSave,
  onCancel
}) => {
  const today = new Date();
  
  const [title, setTitle] = useState(initialSession?.title || "Study Session");
  const [courseId, setCourseId] = useState(initialSession?.courseId || "");
  const [description, setDescription] = useState(initialSession?.description || "");
  const [duration, setDuration] = useState(initialSession?.duration || 90);
  const [date, setDate] = useState<Date>(initialSession?.date || initialDate || today);
  const [time, setTime] = useState(
    initialSession?.date 
      ? format(new Date(initialSession.date), "HH:mm") 
      : format(new Date().setHours(today.getHours() + 1, 0, 0), "HH:mm")
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId) {
      toast.error("Please select a course");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    // Create date object with time
    const [hours, minutes] = time.split(':');
    const sessionDate = new Date(date);
    sessionDate.setHours(parseInt(hours), parseInt(minutes), 0);
    
    onSave({
      title,
      courseId,
      description: description.trim() || undefined,
      duration,
      date: sessionDate
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Study Session Title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Select value={courseId} onValueChange={setCourseId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full bg-${course.color}-500`}></div>
                  {course.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Select 
          value={duration.toString()} 
          onValueChange={(value) => setDuration(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
            <SelectItem value="180">3 hours</SelectItem>
            <SelectItem value="240">4 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Notes (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any notes or details about this study session"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialSession ? 'Update Session' : 'Add Session'}
        </Button>
      </div>
    </form>
  );
};

export default AcademicCalendar;
