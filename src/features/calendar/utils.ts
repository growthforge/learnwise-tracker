
import { CalendarEvent, StudySession } from "./types";
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";

interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

// Generate calendar events from courses, tasks, and sessions
export const generateEvents = (
  courses: Course[],
  tasks: ExtendedTask[] = [],
  sessions: StudySession[] = []
): CalendarEvent[] => {
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

// Filter events based on selected date, courses, and event types
export const filterEvents = (
  events: CalendarEvent[],
  selectedDate: Date,
  selectedCourses: string[],
  eventTypeFilters: string[],
  viewFilter: string
): CalendarEvent[] => {
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
  
  // Filter events for the selected date
  if (selectedDate) {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      const date = new Date(selectedDate);
      
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  }
  
  return filteredEvents;
};
