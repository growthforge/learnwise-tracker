
import { supabase } from "@/integrations/supabase/client";
import { StudySession, SessionFormData } from "@/features/calendar/types";

class SessionService {
  // Convert SessionFormData to StudySession for internal storage
  private convertFormDataToSession(formData: SessionFormData, courseColor: string): StudySession {
    const dateObj = new Date(formData.date);
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    
    dateObj.setHours(hours, minutes, 0, 0);
    
    return {
      id: formData.id,
      title: formData.title || 'Study Session',
      date: dateObj,
      courseId: formData.courseId,
      courseColor: courseColor,
      description: formData.notes,
      duration: formData.duration,
      completed: formData.completed
    };
  }
  
  // Convert StudySession to SessionFormData for form use
  private convertSessionToFormData(session: StudySession): SessionFormData {
    const date = new Date(session.date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return {
      id: session.id,
      courseId: session.courseId,
      title: session.title,
      date: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
      startTime: `${hours}:${minutes}`,
      duration: session.duration,
      completed: session.completed || false,
      notes: session.description
    };
  }

  // Get all study sessions
  async getAllSessions(): Promise<StudySession[]> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        id,
        title,
        date,
        course_id,
        duration,
        description,
        completed,
        courses:course_id (color)
      `);
    
    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
    
    return data.map(session => ({
      id: session.id,
      title: session.title,
      date: new Date(session.date),
      courseId: session.course_id,
      courseColor: session.courses.color,
      description: session.description,
      duration: session.duration,
      completed: session.completed
    }));
  }

  // Get a session by ID
  async getSessionById(id: string): Promise<SessionFormData | null> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        id,
        title,
        date,
        course_id,
        duration,
        description,
        completed,
        courses:course_id (color)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }
    
    const session: StudySession = {
      id: data.id,
      title: data.title,
      date: new Date(data.date),
      courseId: data.course_id,
      courseColor: data.courses.color,
      description: data.description,
      duration: data.duration,
      completed: data.completed
    };
    
    return this.convertSessionToFormData(session);
  }

  // Add a new study session
  async addSession(formData: SessionFormData, courseColor: string): Promise<StudySession> {
    const session = this.convertFormDataToSession(formData, courseColor);
    const dateISOString = session.date.toISOString();
    
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        title: session.title,
        date: dateISOString,
        course_id: session.courseId,
        duration: session.duration,
        description: session.description,
        completed: session.completed
      })
      .select(`
        id,
        title,
        date,
        course_id,
        duration,
        description,
        completed,
        courses:course_id (color)
      `)
      .single();
    
    if (error) {
      console.error('Error adding session:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      date: new Date(data.date),
      courseId: data.course_id,
      courseColor: data.courses.color,
      description: data.description,
      duration: data.duration,
      completed: data.completed
    };
  }

  // Update an existing study session
  async updateSession(formData: SessionFormData, courseColor: string): Promise<StudySession> {
    const session = this.convertFormDataToSession(formData, courseColor);
    const dateISOString = session.date.toISOString();
    
    const { data, error } = await supabase
      .from('study_sessions')
      .update({
        title: session.title,
        date: dateISOString,
        course_id: session.courseId,
        duration: session.duration,
        description: session.description,
        completed: session.completed
      })
      .eq('id', session.id)
      .select(`
        id,
        title,
        date,
        course_id,
        duration,
        description,
        completed,
        courses:course_id (color)
      `)
      .single();
    
    if (error) {
      console.error('Error updating session:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      date: new Date(data.date),
      courseId: data.course_id,
      courseColor: data.courses.color,
      description: data.description,
      duration: data.duration,
      completed: data.completed
    };
  }

  // Delete a study session
  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('study_sessions')
      .delete()
      .eq('id', sessionId);
    
    if (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // Get sessions by course
  async getSessionsByCourse(courseId: string): Promise<StudySession[]> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        id,
        title,
        date,
        course_id,
        duration,
        description,
        completed,
        courses:course_id (color)
      `)
      .eq('course_id', courseId);
    
    if (error) {
      console.error('Error fetching sessions by course:', error);
      return [];
    }
    
    return data.map(session => ({
      id: session.id,
      title: session.title,
      date: new Date(session.date),
      courseId: session.course_id,
      courseColor: session.courses.color,
      description: session.description,
      duration: session.duration,
      completed: session.completed
    }));
  }

  // Get sessions by date range
  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<StudySession[]> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        id,
        title,
        date,
        course_id,
        duration,
        description,
        completed,
        courses:course_id (color)
      `)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());
    
    if (error) {
      console.error('Error fetching sessions by date range:', error);
      return [];
    }
    
    return data.map(session => ({
      id: session.id,
      title: session.title,
      date: new Date(session.date),
      courseId: session.course_id,
      courseColor: session.courses.color,
      description: session.description,
      duration: session.duration,
      completed: session.completed
    }));
  }
}

export const sessionService = new SessionService();
