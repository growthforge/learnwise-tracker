
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task } from './TaskList';
import { toast } from 'sonner';

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
    
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    if (!courseId) {
      toast.error("Please select a course");
      return;
    }
    
    if (!dueDate) {
      toast.error("Due date is required");
      return;
    }
    
    const selectedCourse = courses.find(c => c.id === courseId);
    
    if (!selectedCourse) {
      toast.error("Invalid course selected");
      return;
    }
    
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
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Task title" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="course" className="text-sm font-medium">Course</label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full bg-${course.color}-500`}></div>
                      <span>{course.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
              <Input 
                id="dueDate" 
                type="text" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                placeholder="Tomorrow at 11:59 PM" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="estimatedTime" className="text-sm font-medium">Estimated Hours</label>
            <Input 
              id="estimatedTime" 
              type="number" 
              min="0.5" 
              step="0.5" 
              value={estimatedTime} 
              onChange={(e) => setEstimatedTime(e.target.value)} 
              placeholder="Estimated hours to complete" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Additional details about the task" 
              rows={3} 
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialTask ? 'Update Task' : 'Add Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
