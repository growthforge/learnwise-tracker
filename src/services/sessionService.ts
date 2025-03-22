
import { StudySession } from "@/features/calendar/types";

// This is a local storage service that will be replaced with a database service later
class SessionService {
  private readonly STORAGE_KEY = 'study_sessions';

  // Get all study sessions
  async getAllSessions(): Promise<StudySession[]> {
    const sessions = localStorage.getItem(this.STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  }

  // Add a new study session
  async addSession(session: StudySession): Promise<StudySession> {
    const sessions = await this.getAllSessions();
    sessions.push(session);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    return session;
  }

  // Update an existing study session
  async updateSession(session: StudySession): Promise<StudySession> {
    const sessions = await this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
      return session;
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
