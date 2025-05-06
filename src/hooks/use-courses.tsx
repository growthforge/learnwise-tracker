
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/components/CourseCard';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { sampleCourses } from '@/features/courses/coursesData';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        // Use sample data if not authenticated
        setCourses(sampleCourses);
        return;
      }
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const mappedCourses: Course[] = data.map(course => ({
          id: course.id,
          name: course.name,
          code: course.code,
          color: course.color || 'blue',
          professor: course.professor || '',
          progress: course.progress || 0,
          nextClass: course.next_class ? new Date(course.next_class) : undefined,
          upcomingDeadlines: course.upcoming_deadlines || 0,
          totalHours: course.total_hours_spent || 0,
          totalHoursSpent: course.total_hours_spent || 0
        }));
        setCourses(mappedCourses);
      } else {
        // If no courses found, use sample data as placeholder
        setCourses([]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Add a course
  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add courses');
        return null;
      }
      
      const newCourse = {
        user_id: user.id,
        name: course.name,
        code: course.code,
        color: course.color || 'blue',
        professor: course.professor || '',
        progress: course.progress || 0,
        next_class: course.nextClass?.toISOString(),
        upcoming_deadlines: course.upcomingDeadlines || 0,
        total_hours_spent: course.totalHours || 0
      };
      
      const { data, error } = await supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Course added successfully');
      
      // Add the new course to the state
      const mappedCourse: Course = {
        id: data.id,
        name: data.name,
        code: data.code,
        color: data.color || 'blue',
        professor: data.professor || '',
        progress: data.progress || 0,
        nextClass: data.next_class ? new Date(data.next_class) : undefined,
        upcomingDeadlines: data.upcoming_deadlines || 0,
        totalHours: data.total_hours_spent || 0,
        totalHoursSpent: data.total_hours_spent || 0
      };
      
      setCourses(prev => [...prev, mappedCourse]);
      return mappedCourse;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding course:', err);
      toast.error('Failed to add course');
      return null;
    }
  };

  // Update a course
  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to update courses');
        return false;
      }
      
      // Convert nextClass to ISO string if it exists
      const courseUpdates: any = {
        ...updates,
        next_class: updates.nextClass?.toISOString(),
        total_hours_spent: updates.totalHours || updates.totalHoursSpent
      };
      
      // Remove client-side only properties
      delete courseUpdates.nextClass;
      delete courseUpdates.totalHours;
      delete courseUpdates.totalHoursSpent;
      
      const { error } = await supabase
        .from('courses')
        .update(courseUpdates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update the course in state
      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...updates } : course
      ));
      
      toast.success('Course updated successfully');
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating course:', err);
      toast.error('Failed to update course');
      return false;
    }
  };

  // Delete a course
  const deleteCourse = async (id: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to delete courses');
        return false;
      }
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Remove the course from state
      setCourses(prev => prev.filter(course => course.id !== id));
      
      toast.success('Course deleted successfully');
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting course:', err);
      toast.error('Failed to delete course');
      return false;
    }
  };

  // Load courses on component mount or when user changes
  useEffect(() => {
    fetchCourses();
  }, [user?.id]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse
  };
};
