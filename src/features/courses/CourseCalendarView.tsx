
import React from "react";
import AcademicCalendar from "@/features/calendar/AcademicCalendar";
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";

interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

interface CourseCalendarViewProps {
  courses: Course[];
  tasks?: ExtendedTask[];
  onAddSession?: (session: any) => void;
  onUpdateSession?: (session: any) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const CourseCalendarView: React.FC<CourseCalendarViewProps> = ({ 
  courses, 
  tasks = [],
  onAddSession,
  onUpdateSession,
  onDeleteSession 
}) => {
  return (
    <AcademicCalendar 
      courses={courses} 
      tasks={tasks} 
      showFilters={true}
      onAddSession={onAddSession}
      onUpdateSession={onUpdateSession}
      onDeleteSession={onDeleteSession}
    />
  );
};

export default CourseCalendarView;
