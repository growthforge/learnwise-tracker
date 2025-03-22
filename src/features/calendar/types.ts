
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";

export interface ExtendedTask extends Task {
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

export interface SessionFormData {
  title: string;
  courseId: string;
  description?: string;
  duration: number;
  date: Date;
}
