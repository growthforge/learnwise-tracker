
import React, { useState } from "react";
import AcademicCalendar from "@/features/calendar/AcademicCalendar";
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";
import { StudySession, SessionFormData } from "@/features/calendar/types";
import SessionForm from "@/features/calendar/SessionForm";
import { sessionService } from "@/services/index";
import { toast } from "sonner";

interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

interface CourseCalendarViewProps {
  courses: Course[];
  tasks?: ExtendedTask[];
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
        onUpdateSession?.(updatedSession);
      } else {
        // Add new session
        const newSession = await sessionService.addSession(formData, course.color);
        onAddSession?.(newSession);
      }
    } catch (error) {
      toast.error("Failed to save session");
      console.error(error);
    }
  };
  
  const handleDeleteSession = (sessionId: string) => {
    try {
      sessionService.deleteSession(sessionId);
      onDeleteSession?.(sessionId);
    } catch (error) {
      toast.error("Failed to delete session");
      console.error(error);
    }
  };

  return (
    <>
      <AcademicCalendar 
        courses={courses} 
        tasks={tasks} 
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
