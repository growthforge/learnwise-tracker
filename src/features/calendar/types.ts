
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";

export interface StudySession {
  id: string;
  title: string;
  date: Date;
  courseId: string;
  courseColor: string;
  description?: string;
  duration: number; // in minutes
  completed?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  courseId?: string;
  color?: string;
  type: 'session' | 'task';
  meta?: any;
}

export interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

export interface SessionFormData {
  id: string;
  courseId: string; // This is required
  title?: string;
  date: string; // ISO string
  startTime: string; // HH:MM format
  duration: number; // in minutes
  completed: boolean;
  notes?: string;
}
