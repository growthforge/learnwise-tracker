
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Types
export interface StudySession {
  id: string;
  title: string;
  date: string;
  course_id: string;
  course?: {
    id: string;
    name: string;
    code: string;
    color: string;
  };
  duration: number; // in minutes
  description?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SessionFilters {
  course_id?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  completed?: boolean;
}

// Hooks
export const useSessionService = () => {
  const { user } = useAuth();

  const fetchSessions = async (filters?: SessionFilters): Promise<StudySession[]> => {
    try {
      let query = supabase
        .from('study_sessions')
        .select(`
          *,
          courses:course_id(id, name, code, color)
        `)
        .eq('user_id', user?.id);

      // Apply filters if provided
      if (filters) {
        if (filters.course_id) {
          query = query.eq('course_id', filters.course_id);
        }

        if (filters.dateRange) {
          query = query
            .gte('date', filters.dateRange.from.toISOString())
            .lte('date', filters.dateRange.to.toISOString());
        }

        if (filters.completed !== undefined) {
          query = query.eq('completed', filters.completed);
        }
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(session => ({
        id: session.id,
        title: session.title,
        date: session.date,
        course_id: session.course_id,
        course: session.courses ? {
          id: session.courses.id,
          name: session.courses.name,
          code: session.courses.code,
          color: session.courses.color,
        } : undefined,
        duration: session.duration,
        description: session.description || '',
        completed: session.completed,
        created_at: session.created_at,
        updated_at: session.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load study sessions');
      return [];
    }
  };

  const fetchSessionById = async (id: string): Promise<StudySession | null> => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          courses:course_id(id, name, code, color)
        `)
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        title: data.title,
        date: data.date,
        course_id: data.course_id,
        course: data.courses ? {
          id: data.courses.id,
          name: data.courses.name,
          code: data.courses.code,
          color: data.courses.color,
        } : undefined,
        duration: data.duration,
        description: data.description || '',
        completed: data.completed,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching session:', error);
      toast.error('Failed to load study session');
      return null;
    }
  };

  const createSession = async (sessionData: {
    title: string;
    date: string;
    course_id: string;
    duration: number;
    description: string;
    completed: boolean;
  }): Promise<StudySession | null> => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          ...sessionData,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Study session created successfully');
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create study session');
      return null;
    }
  };

  const updateSession = async (id: string, sessionData: Partial<StudySession>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .update(sessionData)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      toast.success('Study session updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update study session');
      return false;
    }
  };

  const deleteSession = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      toast.success('Study session deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete study session');
      return false;
    }
  };

  return {
    fetchSessions,
    fetchSessionById,
    createSession,
    updateSession,
    deleteSession,
  };
};
