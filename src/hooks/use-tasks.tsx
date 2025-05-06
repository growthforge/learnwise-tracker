
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/components/TaskList';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { sampleTasks } from '@/features/tasks/taskUtils';

export const useTasks = (initialFilter?: 'all' | 'completed' | 'pending') => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>(initialFilter || 'all');
  const { user } = useAuth();

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        // Use sample data if not authenticated
        let filteredTasks = [...sampleTasks];
        if (filter === 'completed') {
          filteredTasks = sampleTasks.filter(task => task.completed);
        } else if (filter === 'pending') {
          filteredTasks = sampleTasks.filter(task => !task.completed);
        }
        setTasks(filteredTasks);
        return;
      }
      
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
      
      // Apply filter
      if (filter === 'completed') {
        query = query.eq('completed', true);
      } else if (filter === 'pending') {
        query = query.eq('completed', false);
      }
      
      // Order by due date
      query = query.order('due_date', { ascending: true });
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const mappedTasks: Task[] = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          completed: task.completed || false,
          courseId: task.course_id,
          course: task.course_name || '',
          dueText: task.due_text || '',
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          due: task.due_text || '',
          priority: task.priority || 'medium',
          estimatedTime: task.estimated_time || 0
        }));
        setTasks(mappedTasks);
      } else {
        // If no tasks found, use empty array
        setTasks([]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Add a task
  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add tasks');
        return null;
      }
      
      const newTask = {
        user_id: user.id,
        title: task.title,
        description: task.description || '',
        completed: task.completed || false,
        course_id: task.courseId,
        course_name: task.course || '',
        due_text: task.dueText || task.due || '',
        due_date: task.dueDate?.toISOString(),
        priority: task.priority || 'medium',
        estimated_time: task.estimatedTime || 0
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Task added successfully');
      
      // Add the new task to the state
      const mappedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        completed: data.completed || false,
        courseId: data.course_id,
        course: data.course_name || '',
        dueText: data.due_text || '',
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        due: data.due_text || '',
        priority: data.priority || 'medium',
        estimatedTime: data.estimated_time || 0
      };
      
      // Only add to state if it matches the current filter
      if (filter === 'all' || 
         (filter === 'completed' && mappedTask.completed) || 
         (filter === 'pending' && !mappedTask.completed)) {
        setTasks(prev => [...prev, mappedTask]);
      }
      
      return mappedTask;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
      return null;
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    try {
      // Find the task to toggle
      const task = tasks.find(t => t.id === id);
      if (!task) {
        toast.error('Task not found');
        return false;
      }
      
      if (!user) {
        toast.error('You must be logged in to update tasks');
        return false;
      }
      
      // Update the task locally first for better UX
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
      
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        // Revert the change if there was an error
        setTasks(prev => prev.map(t => 
          t.id === id ? { ...t, completed: task.completed } : t
        ));
        throw error;
      }
      
      toast.success(`Task ${!task.completed ? 'completed' : 'reopened'}`);
      
      // Remove from state if it no longer matches the filter
      if ((filter === 'completed' && task.completed) || 
          (filter === 'pending' && !task.completed)) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error toggling task completion:', err);
      toast.error('Failed to update task');
      return false;
    }
  };

  // Update a task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to update tasks');
        return false;
      }
      
      // Convert dueDate to ISO string if it exists
      const taskUpdates: any = {
        ...updates,
        due_text: updates.dueText || updates.due,
        due_date: updates.dueDate?.toISOString(),
        course_id: updates.courseId,
        course_name: updates.course,
        estimated_time: updates.estimatedTime
      };
      
      // Remove client-side only properties
      delete taskUpdates.dueText;
      delete taskUpdates.dueDate;
      delete taskUpdates.due;
      delete taskUpdates.courseId;
      delete taskUpdates.course;
      delete taskUpdates.estimatedTime;
      
      const { error } = await supabase
        .from('tasks')
        .update(taskUpdates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update the task in state
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
      
      toast.success('Task updated successfully');
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      return false;
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to delete tasks');
        return false;
      }
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Remove the task from state
      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast.success('Task deleted successfully');
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      return false;
    }
  };

  // Change the filter
  const changeFilter = (newFilter: 'all' | 'completed' | 'pending') => {
    setFilter(newFilter);
  };

  // Load tasks when filter changes or user changes
  useEffect(() => {
    fetchTasks();
  }, [filter, user?.id]);

  return {
    tasks,
    loading,
    error,
    filter,
    fetchTasks,
    addTask,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    changeFilter
  };
};
