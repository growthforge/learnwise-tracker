
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
  date: Date; // Change from start/end to date
  courseId?: string;
  courseColor?: string;
  description?: string;
  duration?: number;
  type: 'session' | 'task' | 'class' | 'completed' | 'deadline'; // Include all possible event types
  meta?: any;
}

// Update ExtendedTask to handle both Date objects and string dates
export interface ExtendedTask extends Omit<Task, 'dueDate'> {
  dueDate?: Date | string;
}

// Update to match the service definition (title is required)
export interface SessionFormData {
  id: string;
  courseId: string;
  title: string; // Now required
  date: string; // ISO string
  startTime: string; // HH:MM format
  duration: number; // in minutes
  completed: boolean;
  notes?: string;
}
