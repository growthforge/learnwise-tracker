
import { toast } from 'sonner';

interface ValidationParams {
  title: string;
  courseId: string;
  dueDate: string;
  courses: Array<{ id: string; name: string; code: string; color: string; }>;
}

export const validateTaskForm = ({ title, courseId, dueDate, courses }: ValidationParams): boolean => {
  if (!title.trim()) {
    toast.error("Task title is required");
    return false;
  }
  
  if (!courseId) {
    toast.error("Please select a course");
    return false;
  }
  
  if (!dueDate) {
    toast.error("Due date is required");
    return false;
  }
  
  const selectedCourse = courses.find(c => c.id === courseId);
  
  if (!selectedCourse) {
    toast.error("Invalid course selected");
    return false;
  }
  
  return true;
};
