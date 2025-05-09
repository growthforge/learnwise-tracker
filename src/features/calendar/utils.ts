
import { CalendarEvent, StudySession, ExtendedTask } from "./types";
import { Course, CourseNextClass } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";

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
      
      // Create a date for the next class - handling nextClass correctly
      let nextClassDate: Date;
      
      if (typeof course.nextClass === 'object' && course.nextClass instanceof Date) {
        // If nextClass is already a Date object
        nextClassDate = new Date(course.nextClass);
      } else if (typeof course.nextClass === 'object' && 'day' in course.nextClass) {
        // If nextClass is a CourseNextClass object with 'day' property
        const courseNextClass = course.nextClass as CourseNextClass;
        const dayOfWeek = dayMap[courseNextClass.day];
        const currentDay = today.getDay();
        const daysUntilClass = (dayOfWeek - currentDay + 7) % 7;
        nextClassDate = new Date(today);
        nextClassDate.setDate(today.getDate() + daysUntilClass);
        
        // Set the class time
        if (courseNextClass.time) {
          const timeStr = courseNextClass.time;
          const [hours, minutes] = timeStr.split(':').length > 1 
            ? timeStr.split(':')
            : timeStr.includes('AM') || timeStr.includes('PM')
              ? [timeStr.split(' ')[0], '00']
              : ['09', '00'];
              
          const isPM = timeStr.includes('PM');
          const hour = parseInt(hours) + (isPM && parseInt(hours) < 12 ? 12 : 0);
          
          nextClassDate.setHours(hour, parseInt(minutes) || 0);
        }
      } else {
        // Default fallback
        nextClassDate = new Date();
        nextClassDate.setDate(today.getDate() + 1);
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
      // Convert string dates to Date objects safely
      let dueDate: Date;
      
      if (task.dueDate) {
        if (task.dueDate instanceof Date) {
          dueDate = task.dueDate;
        } else {
          // Try to parse the string date safely
          try {
            dueDate = new Date(task.dueDate);
            
            // Check if the date is valid
            if (isNaN(dueDate.getTime())) {
              // Use a fallback date
              dueDate = new Date();
              dueDate.setDate(dueDate.getDate() + 7); // Default to 1 week from now
            }
          } catch (error) {
            // Use a fallback date
            dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7); // Default to 1 week from now
          }
        }
      } else {
        // Try to interpret the due text
        const dueText = task.due || '';
        
        if (dueText.toLowerCase().includes('tomorrow')) {
          dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 1);
        } else if (dueText.toLowerCase().includes('today')) {
          dueDate = new Date();
        } else if (dueText.toLowerCase().includes('next')) {
          dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7);
        } else {
          // Default fallback
          dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 3);
        }
      }
      
      events.push({
        id: `task-${task.id}`,
        title: task.title,
        date: dueDate,
        type: task.completed ? 'completed' : 'task',
        courseId: task.courseId,
        courseColor: task.course?.color || '',
        description: task.description || `Priority: ${task.priority}`,
        duration: task.estimatedTime ? task.estimatedTime * 60 : 30 // Convert hours to minutes
      });
    }
  });
  
  // Add study session events
  sessions.forEach(session => {
    // Ensure session.date is a valid Date object
    let sessionDate: Date;
    
    if (session.date instanceof Date) {
      sessionDate = new Date(session.date);
    } else {
      try {
        sessionDate = new Date(session.date);
        
        // Check if date is valid
        if (isNaN(sessionDate.getTime())) {
          // Use current date as fallback
          sessionDate = new Date();
        }
      } catch (error) {
        // Use current date as fallback
        sessionDate = new Date();
      }
    }
    
    events.push({
      id: `session-${session.id}`,
      title: session.title,
      date: sessionDate,
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
