
import React from "react";
import { sampleCourses } from "@/features/courses/coursesData";
import AcademicCalendar from "@/features/calendar/AcademicCalendar";

// Sample tasks for the calendar view
const sampleTasks = [
  {
    id: "task-1",
    title: "Complete ML Assignment",
    course: {
      id: "course-1",
      name: "Machine Learning",
      code: "CS-433",
      color: "blue"
    },
    due: "Tomorrow at 11:59 PM",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completed: false,
    priority: "high" as const,
    estimatedTime: 3,
    description: "Implement and train a neural network model"
  },
  {
    id: "task-2",
    title: "Read Chapter 5",
    course: {
      id: "course-3",
      name: "Linear Algebra",
      code: "MATH-304",
      color: "purple"
    },
    due: "Friday at 8:00 AM",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    completed: false,
    priority: "medium" as const,
    estimatedTime: 1.5,
    description: "Read about eigenvalues and eigenvectors"
  },
  {
    id: "task-3",
    title: "Submit Economics Quiz",
    course: {
      id: "course-4",
      name: "Economics 101",
      code: "ECON-101",
      color: "amber"
    },
    due: "Today at 5:00 PM",
    dueDate: new Date(),
    completed: true,
    priority: "high" as const,
    estimatedTime: 0.5
  }
];

// Sample study sessions for the calendar
const sampleSessions = [
  {
    id: "session-1",
    title: "Study Session: Machine Learning",
    date: new Date(new Date().setHours(new Date().getHours() + 5)),
    type: "session" as const,
    courseId: "course-1",
    courseColor: "blue",
    description: "Group study in library",
    duration: 120 // 2 hours
  },
  {
    id: "session-2",
    title: "Study Session: Economics",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: "session" as const,
    courseId: "course-4",
    courseColor: "amber",
    description: "Review session before quiz",
    duration: 90 // 1.5 hours
  }
];

const Schedule: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Academic Schedule</h1>
      <p className="text-muted-foreground">
        View and manage your academic schedule, including classes, tasks, and study sessions.
      </p>
      
      <AcademicCalendar 
        courses={sampleCourses}
        tasks={sampleTasks}
      />
    </div>
  );
};

export default Schedule;
