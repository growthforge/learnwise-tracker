
import React, { useState } from "react";
import { sampleCourses } from "@/features/courses/coursesData";
import AcademicCalendar from "@/features/calendar/AcademicCalendar";
import { StudySession, ExtendedTask } from "@/features/calendar/types";
import { AIScheduleSuggestion } from "@/services/aiService";
import { toast } from "sonner";
import AIScheduleSuggestions from "@/features/ai/AIScheduleSuggestions";
import { v4 as uuidv4 } from "uuid";

// Sample tasks for the calendar view with added courseId property
const sampleTasks: ExtendedTask[] = [
  {
    id: "task-1",
    title: "Complete ML Assignment",
    courseId: "course-1",
    course: {
      id: "course-1",
      name: "Machine Learning",
      code: "CS-433",
      color: "blue"
    },
    due: "Tomorrow at 11:59 PM",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completed: false,
    priority: "high",
    estimatedTime: 3,
    description: "Implement and train a neural network model"
  },
  {
    id: "task-2",
    title: "Read Chapter 5",
    courseId: "course-3",
    course: {
      id: "course-3",
      name: "Linear Algebra",
      code: "MATH-304",
      color: "purple"
    },
    due: "Friday at 8:00 AM",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    completed: false,
    priority: "medium",
    estimatedTime: 1.5,
    description: "Read about eigenvalues and eigenvectors"
  },
  {
    id: "task-3",
    title: "Submit Economics Quiz",
    courseId: "course-4",
    course: {
      id: "course-4",
      name: "Economics 101",
      code: "ECON-101",
      color: "amber"
    },
    due: "Today at 5:00 PM",
    dueDate: new Date(),
    completed: true,
    priority: "high",
    estimatedTime: 0.5
  }
];

// Sample study sessions for the calendar
const initialSessions: StudySession[] = [
  {
    id: "session-1",
    title: "Study Session: Machine Learning",
    date: new Date(new Date().setHours(new Date().getHours() + 5)),
    courseId: "course-1",
    courseColor: "blue",
    description: "Group study in library",
    duration: 120 // 2 hours
  },
  {
    id: "session-2",
    title: "Study Session: Economics",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    courseId: "course-4",
    courseColor: "amber",
    description: "Review session before quiz",
    duration: 90 // 1.5 hours
  }
];

const Schedule: React.FC = () => {
  const [studySessions, setStudySessions] = useState<StudySession[]>(initialSessions);
  
  const handleAddSession = () => {
    // This function will be called when the "Add Session" button is clicked
    // The actual session will be created in the form and added via handleUpdateSession
    // This is just to open the form
  };
  
  const handleUpdateSession = (updatedSession: StudySession) => {
    setStudySessions(
      studySessions.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );
    toast.success("Study session updated");
  };
  
  const handleDeleteSession = (sessionId: string) => {
    setStudySessions(
      studySessions.filter(session => session.id !== sessionId)
    );
    toast.success("Study session deleted");
  };

  // Convert study sessions to a format that the AI can understand
  const getFormattedSchedule = () => {
    return studySessions.map(session => ({
      day: new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' }),
      time: new Date(session.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      courseName: sampleCourses.find(c => c.id === session.courseId)?.name || 'Unknown Course',
      duration: session.duration
    }));
  };

  // Handle applying AI suggestion to the schedule
  const handleApplySuggestion = (suggestion: AIScheduleSuggestion) => {
    // Find the course that matches the suggested course name
    const course = sampleCourses.find(c => c.name === suggestion.courseName);
    
    if (!course) {
      toast.error(`Could not find course: ${suggestion.courseName}`);
      return;
    }
    
    // Parse the day of week and time to create a Date object
    const dayMap: Record<string, number> = {
      "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 0
    };
    
    const today = new Date();
    const dayOfWeek = dayMap[suggestion.dayOfWeek];
    const currentDay = today.getDay();
    const daysUntilSession = (dayOfWeek - currentDay + 7) % 7;
    
    const sessionDate = new Date();
    sessionDate.setDate(today.getDate() + daysUntilSession);
    
    // Set the time from the suggestion
    const [hours, minutes] = suggestion.startTime.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);
    
    // Create a new study session
    const newSession: StudySession = {
      id: `ai-suggested-${uuidv4()}`,
      title: `Study Session: ${course.name}`,
      date: sessionDate,
      courseId: course.id,
      courseColor: course.color,
      description: `AI suggested: ${suggestion.reason}`,
      duration: suggestion.duration
    };
    
    // Add the session to the list
    setStudySessions([...studySessions, newSession]);
    toast.success(`Added ${course.name} study session on ${suggestion.dayOfWeek}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Academic Schedule</h1>
      <p className="text-muted-foreground">
        View and manage your academic schedule, including classes, tasks, and study sessions.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AcademicCalendar 
            courses={sampleCourses}
            tasks={sampleTasks}
            sessions={studySessions}
            onAddSession={handleAddSession}
            onUpdateSession={handleUpdateSession}
            onEditSession={sessionId => {
              // Find the session and open edit form
              const session = studySessions.find(s => s.id === sessionId);
              if (session) {
                // The actual form will be opened by the AcademicCalendar component
              }
            }}
            onDeleteSession={handleDeleteSession}
          />
        </div>
        <div>
          <AIScheduleSuggestions 
            courses={sampleCourses}
            existingSchedule={getFormattedSchedule()}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
