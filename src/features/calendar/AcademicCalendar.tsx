import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";
import { toast } from "sonner";
import { CalendarEvent, StudySession, SessionFormData, ExtendedTask } from "./types";
import { generateEvents, filterEvents } from "./utils";
import { 
  CalendarSidebar,
  CalendarEventList,
  CalendarFiltersDialog
} from "./components";
import SessionForm from "./SessionForm";

// Extend the Task interface to include properties needed for the calendar
interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

interface AcademicCalendarProps {
  courses: Course[];
  tasks?: ExtendedTask[];
  sessions?: StudySession[];
  onAddSession?: () => void;
  onEditSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onUpdateSession?: (session: StudySession) => void;
  showFilters?: boolean;
  className?: string;
}

const AcademicCalendar: React.FC<AcademicCalendarProps> = ({ 
  courses, 
  tasks = [],
  sessions = [],
  onAddSession,
  onEditSession,
  onDeleteSession,
  onUpdateSession,
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
  
  // Reset filters to default values
  const resetFilters = () => {
    setSelectedCourses(courses.map(c => c.id));
    setEventTypeFilters(["class", "task", "completed", "deadline", "session"]);
  };
  
  // Open session form for adding
  const handleAddSession = (date: Date) => {
    setNewSessionDate(date);
    setSessionToEdit(null);
    setIsSessionFormOpen(true);
    if (onAddSession) {
      onAddSession();
    }
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
  const handleSaveSession = (sessionData: SessionFormData) => {
    const course = courses.find(c => c.id === sessionData.courseId);
    
    if (!course) {
      toast.error("Please select a valid course");
      return;
    }
    
    // Create a date from the form data
    const sessionDate = new Date(sessionData.date);
    const [hours, minutes] = sessionData.startTime.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);
    
    if (sessionToEdit) {
      // Update existing session
      const updatedSession: StudySession = {
        ...sessionToEdit,
        title: sessionData.title || 'Study Session',
        date: sessionDate,
        courseId: sessionData.courseId,
        courseColor: course.color,
        description: sessionData.notes,
        duration: sessionData.duration,
        completed: sessionData.completed
      };
      
      if (onUpdateSession) {
        onUpdateSession(updatedSession);
        toast.success("Study session updated");
      }
    } else {
      // Create new session
      const newSession: StudySession = {
        id: sessionData.id,
        title: sessionData.title || 'Study Session',
        date: sessionDate,
        courseId: sessionData.courseId,
        courseColor: course.color,
        description: sessionData.notes,
        duration: sessionData.duration,
        completed: sessionData.completed
      };
      
      if (onUpdateSession) {
        onUpdateSession(newSession);
        toast.success("Study session added");
      }
    }
    
    setIsSessionFormOpen(false);
    setSessionToEdit(null);
    setNewSessionDate(null);
  };
  
  // Generate all events
  const events = generateEvents(courses, tasks, sessions);
  
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
  const selectedDateEvents = filterEvents(
    filteredEvents, 
    date, 
    selectedCourses, 
    eventTypeFilters, 
    viewFilter
  );

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
        <CalendarSidebar 
          date={date}
          onDateSelect={setDate}
          onAddSession={handleAddSession}
          events={filteredEvents}
        />

        <CalendarEventList 
          date={date}
          events={selectedDateEvents}
          sessions={sessions}
          onEditSession={onEditSession}
          onDeleteSession={onDeleteSession}
        />
      </div>
      
      {/* Filters Dialog */}
      <CalendarFiltersDialog 
        isOpen={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        courses={courses}
        selectedCourses={selectedCourses}
        eventTypeFilters={eventTypeFilters}
        onToggleCourseFilter={toggleCourseFilter}
        onToggleEventTypeFilter={toggleEventTypeFilter}
        onResetFilters={resetFilters}
      />
      
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
      
      {/* Session Form Dialog */}
      <SessionForm 
        isOpen={isSessionFormOpen} 
        onClose={() => setIsSessionFormOpen(false)} 
        onSave={handleSaveSession}
        initialSession={sessionToEdit ? {
          id: sessionToEdit.id,
          courseId: sessionToEdit.courseId,
          title: sessionToEdit.title,
          date: format(new Date(sessionToEdit.date), 'yyyy-MM-dd'),
          startTime: format(new Date(sessionToEdit.date), 'HH:mm'),
          duration: sessionToEdit.duration,
          completed: sessionToEdit.completed ?? true,
          notes: sessionToEdit.description
        } : undefined}
        courses={courses}
      />
    </div>
  );
};

export default AcademicCalendar;
