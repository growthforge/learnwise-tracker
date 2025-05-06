import React, { useState } from "react";
import AcademicCalendar from "@/features/calendar/AcademicCalendar";
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";
import { StudySession, SessionFormData, ExtendedTask } from "@/features/calendar/types";
import SessionForm from "@/features/calendar/SessionForm";
import { sessionService } from "@/services/sessionService";
import { toast } from "sonner";

interface CourseCalendarViewProps {
  courses: Course[];
  tasks?: Task[];
  onAddSession?: (session: StudySession) => void;
  onUpdateSession?: (session: StudySession) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const CourseCalendarView: React.FC<CourseCalendarViewProps> = ({ 
  courses, 
  tasks = [],
  onAddSession,
  onUpdateSession,
  onDeleteSession 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionFormData | undefined>(undefined);
  
  const handleOpenAddForm = () => {
    setCurrentSession(undefined);
    setIsFormOpen(true);
  };
  
  const handleOpenEditForm = async (sessionId: string) => {
    try {
      const session = await sessionService.getSessionById(sessionId);
      if (session) {
        setCurrentSession(session);
        setIsFormOpen(true);
      }
    } catch (error) {
      toast.error("Failed to load session details");
    }
  };
  
  const handleSaveSession = async (formData: SessionFormData) => {
    try {
      const course = courses.find(c => c.id === formData.courseId);
      
      if (!course) {
        toast.error("Course not found");
        return;
      }
      
      if (formData.id.includes("session-") && !formData.id.includes("new")) {
        // Update existing session
        const updatedSession = await sessionService.updateSession(formData, course.color);
        if (onUpdateSession) {
          onUpdateSession(updatedSession);
        }
      } else {
        // Add new session
        const newSession = await sessionService.addSession(formData, course.color);
        if (onAddSession) {
          onAddSession(newSession);
        }
      }
    } catch (error) {
      toast.error("Failed to save session");
      console.error(error);
    }
  };
  
  const handleDeleteSession = (sessionId: string) => {
    try {
      sessionService.deleteSession(sessionId);
      if (onDeleteSession) {
        onDeleteSession(sessionId);
      }
    } catch (error) {
      toast.error("Failed to delete session");
      console.error(error);
    }
  };

  // Convert tasks to ExtendedTask type with proper interface compatibility
  const extendedTasks: ExtendedTask[] = tasks.map(task => ({
    ...task,
    dueDate: task.dueDate || new Date()
  }));

  return (
    <>
      <AcademicCalendar 
        courses={courses} 
        tasks={extendedTasks} 
        showFilters={true}
        onAddSession={handleOpenAddForm}
        onEditSession={handleOpenEditForm}
        onDeleteSession={handleDeleteSession}
      />
      
      <SessionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveSession}
        initialSession={currentSession}
        courses={courses}
      />
    </>
  );
};

export default CourseCalendarView;
