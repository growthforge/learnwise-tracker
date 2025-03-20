
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
}

const CourseCalendarView: React.FC<CourseCalendarViewProps> = ({ courses, tasks = [] }) => {
  return (
    <AcademicCalendar 
      courses={courses} 
      tasks={tasks} 
      showFilters={false}
    />
  );
};

export default CourseCalendarView;
