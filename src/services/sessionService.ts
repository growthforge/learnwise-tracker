
import { StudySession, SessionFormData } from "@/features/calendar/types";

// This is a local storage service that will be replaced with a database service later
class SessionService {
  private readonly STORAGE_KEY = 'study_sessions';

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
    const sessions = localStorage.getItem(this.STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  }

  // Get a session by ID
  async getSessionById(id: string): Promise<SessionFormData | null> {
    const sessions = await this.getAllSessions();
    const session = sessions.find(s => s.id === id);
    
    if (!session) return null;
    
    return this.convertSessionToFormData(session);
  }

  // Add a new study session
  async addSession(formData: SessionFormData, courseColor: string): Promise<StudySession> {
    const sessions = await this.getAllSessions();
    const newSession = this.convertFormDataToSession(formData, courseColor);
    
    sessions.push(newSession);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    
    return newSession;
  }

  // Update an existing study session
  async updateSession(formData: SessionFormData, courseColor: string): Promise<StudySession> {
    const sessions = await this.getAllSessions();
    const updatedSession = this.convertFormDataToSession(formData, courseColor);
    const index = sessions.findIndex(s => s.id === formData.id);
    
    if (index >= 0) {
      sessions[index] = updatedSession;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
      return updatedSession;
    }
    
    throw new Error('Session not found');
  }

  // Delete a study session
  async deleteSession(sessionId: string): Promise<void> {
    const sessions = await this.getAllSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSessions));
  }

  // Get sessions by course
  async getSessionsByCourse(courseId: string): Promise<StudySession[]> {
    const sessions = await this.getAllSessions();
    return sessions.filter(s => s.courseId === courseId);
  }

  // Get sessions by date range
  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<StudySession[]> {
    const sessions = await this.getAllSessions();
    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }
}

export const sessionService = new SessionService();
