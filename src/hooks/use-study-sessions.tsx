
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StudySession } from '@/features/calendar/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useStudySessions = (courseId?: string) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch study sessions
  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        setSessions([]);
        setLoading(false);
        return;
      }
      
      let query = supabase
        .from('study_sessions')
        .select(`
          *,
          courses:course_id(name, color)
        `)
        .eq('user_id', user.id);
      
      // Filter by course if provided
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      
      // Order by date
      query = query.order('date', { ascending: false });
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const mappedSessions: StudySession[] = data.map(session => ({
          id: session.id,
          title: session.title,
          date: new Date(session.date),
          courseId: session.course_id,
          courseColor: session.courses?.color || 'blue',
          description: session.description,
          duration: session.duration || 0,
          completed: session.completed || false
        }));
        setSessions(mappedSessions);
      } else {
        // If no sessions found, use empty array
        setSessions([]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching study sessions:', err);
      toast.error('Failed to load study sessions');
    } finally {
      setLoading(false);
    }
  };

  // Add a study session
  const addSession = async (session: Omit<StudySession, 'id' | 'courseColor'>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add study sessions');
        return null;
      }
      
      const newSession = {
        user_id: user.id,
        title: session.title,
        description: session.description || '',
        date: session.date.toISOString(),
        course_id: session.courseId,
        duration: session.duration || 0,
        completed: session.completed || false
      };
      
      const { data, error } = await supabase
        .from('study_sessions')
        .insert(newSession)
        .select(`
          *,
          courses:course_id(name, color)
        `)
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Study session added successfully');
      
      // Add the new session to the state
      const mappedSession: StudySession = {
        id: data.id,
        title: data.title,
        date: new Date(data.date),
        courseId: data.course_id,
        courseColor: data.courses?.color || 'blue',
        description: data.description,
        duration: data.duration || 0,
        completed: data.completed || false
      };
      
      setSessions(prev => [mappedSession, ...prev]);
      return mappedSession;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding study session:', err);
      toast.error('Failed to add study session');
      return null;
    }
  };

  // Update a study session
  const updateSession = async (id: string, updates: Partial<StudySession>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to update study sessions');
        return false;
      }
      
      // Format the data for Supabase
      const sessionUpdates: any = {
        ...updates,
        date: updates.date?.toISOString(),
        course_id: updates.courseId
      };
      
      // Remove client-side properties
      delete sessionUpdates.courseId;
      delete sessionUpdates.courseColor;
      
      const { error } = await supabase
        .from('study_sessions')
        .update(sessionUpdates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update the session in state
      setSessions(prev => prev.map(session => 
        session.id === id ? { ...session, ...updates } : session
      ));
      
      toast.success('Study session updated successfully');
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating study session:', err);
      toast.error('Failed to update study session');
      return false;
    }
  };

  // Delete a study session
  const deleteSession = async (id: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to delete study sessions');
        return false;
      }
      
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Remove the session from state
      setSessions(prev => prev.filter(session => session.id !== id));
      
      toast.success('Study session deleted successfully');
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting study session:', err);
      toast.error('Failed to delete study session');
      return false;
    }
  };

  // Load sessions on component mount or when user changes
  useEffect(() => {
    fetchSessions();
  }, [user?.id, courseId]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    addSession,
    updateSession,
    deleteSession
  };
};
