
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task } from './TaskList';
import { toast } from 'sonner';
import TaskTitleField from '@/features/tasks/form/TaskTitleField';
import TaskCourseField from '@/features/tasks/form/TaskCourseField';
import TaskDatePriorityFields from '@/features/tasks/form/TaskDatePriorityFields';
import TaskTimeField from '@/features/tasks/form/TaskTimeField';
import TaskDescriptionField from '@/features/tasks/form/TaskDescriptionField';
import TaskFormActions from '@/features/tasks/form/TaskFormActions';
import { validateTaskForm } from '@/features/tasks/form/taskFormValidation';

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task;
  courses: Course[];
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTask,
  courses
}) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<"high" | "medium" | "low">('medium');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [description, setDescription] = useState('');

  // Populate form when editing an existing task
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCourseId(initialTask.course.id);
      setDueDate(initialTask.due);
      setPriority(initialTask.priority);
      setEstimatedTime(initialTask.estimatedTime?.toString() || '');
      setDescription(initialTask.description || '');
    } else {
      // Reset form when adding a new task
      setTitle('');
      setCourseId('');
      setDueDate('');
      setPriority('medium');
      setEstimatedTime('');
      setDescription('');
    }
  }, [initialTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTaskForm({ title, courseId, dueDate, courses })) {
      return;
    }
    
    const selectedCourse = courses.find(c => c.id === courseId)!;
    
    const taskData: Task = {
      id: initialTask?.id || `task-${Date.now()}`,
      title,
      course: {
        id: selectedCourse.id,
        name: selectedCourse.name,
        code: selectedCourse.code,
        color: selectedCourse.color
      },
      due: dueDate,
      completed: initialTask?.completed || false,
      priority,
      estimatedTime: estimatedTime ? parseFloat(estimatedTime) : undefined,
      description
    };
    
    onSave(taskData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <TaskTitleField 
            value={title} 
            onChange={setTitle} 
          />
          
          <TaskCourseField 
            value={courseId} 
            onChange={setCourseId} 
            courses={courses} 
          />
          
          <TaskDatePriorityFields 
            dueDate={dueDate}
            onDueDateChange={setDueDate}
            priority={priority}
            onPriorityChange={setPriority}
          />
          
          <TaskTimeField 
            value={estimatedTime} 
            onChange={setEstimatedTime} 
          />
          
          <TaskDescriptionField 
            value={description} 
            onChange={setDescription} 
          />
          
          <TaskFormActions 
            onCancel={onClose} 
            isEditing={!!initialTask} 
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
