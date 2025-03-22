
// AI Service using OpenRouter API
import { toast } from "sonner";

export interface AIStudyRecommendation {
  courseId: string;
  courseName: string;
  recommendedHours: number;
  reason: string;
}

export interface AIScheduleSuggestion {
  courseName: string;
  dayOfWeek: string;
  startTime: string;
  duration: number;
  reason: string;
}

export interface AIPrioritizedTask {
  taskId: string;
  taskTitle: string;
  priority: number; // 1-10 scale
  reasoning: string;
}

// You'll need to replace this with your actual OpenRouter API key
// For security reasons, this should be handled through a backend service
// For demo purposes only, we'll use localStorage to temporarily store it
const API_KEY_STORAGE_KEY = "openrouter_api_key";

export const aiService = {
  // Set API key to localStorage (for demo purposes only)
  setApiKey: (apiKey: string): void => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },

  // Check if API key exists
  hasApiKey: (): boolean => {
    return !!localStorage.getItem(API_KEY_STORAGE_KEY);
  },

  // Get API key from localStorage
  getApiKey: (): string | null => {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },

  // Clear API key
  clearApiKey: (): void => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  // Base method to make OpenRouter API calls
  callOpenRouter: async (prompt: string, model: string = "openai/gpt-3.5-turbo"): Promise<any> => {
    const apiKey = aiService.getApiKey();
    
    if (!apiKey) {
      throw new Error("API key not found. Please set your OpenRouter API key first.");
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin, // Required for OpenRouter
          "X-Title": "StudyPal AI" // Optional - your app name
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are an AI study assistant that helps students optimize their study time and academic performance."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error calling OpenRouter API");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  // Get study recommendation based on courses and tasks
  getStudyRecommendations: async (
    courses: any[],
    tasks: any[],
    studyHours: number[] = []
  ): Promise<AIStudyRecommendation[]> => {
    try {
      // Create a prompt with course and task information
      const coursesInfo = courses.map(c => 
        `Course: ${c.name} (${c.code}), Progress: ${c.progress}%, Upcoming deadlines: ${c.upcomingDeadlines}`
      ).join("\n");
      
      const tasksInfo = tasks.map(t => 
        `Task: ${t.title} for ${t.course.name}, Due: ${t.due}, Priority: ${t.priority}, Est. time: ${t.estimatedTime}h, Completed: ${t.completed}`
      ).join("\n");
      
      const studyHistory = studyHours.length > 0 
        ? `Recent daily study hours: ${studyHours.join(', ')} hours`
        : "No recent study history available";

      const prompt = `Based on the following information about my courses and tasks, provide 1-3 specific study recommendations. Format your response as a JSON array where each item has courseId, courseName, recommendedHours (numeric), and reason fields.

Courses:
${coursesInfo}

Tasks:
${tasksInfo}

${studyHistory}

Please consider urgency of deadlines, current progress, and provide a balanced recommendation.`;

      const response = await aiService.callOpenRouter(prompt);
      
      // Parse JSON from the response
      // The response might include markdown formatting, so we need to extract just the JSON part
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                         response.match(/```\n([\s\S]*?)\n```/) ||
                         response.match(/\[([\s\S]*?)\]/);
                         
      const jsonText = jsonMatch ? jsonMatch[1] : response;
      let recommendations: AIStudyRecommendation[] = [];
      
      try {
        recommendations = JSON.parse(jsonText.includes('[') ? jsonText : `[${jsonText}]`);
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        console.log("Raw response:", response);
        throw new Error("Failed to parse AI recommendation data");
      }
      
      return recommendations;
    } catch (error) {
      console.error("Error getting AI study recommendations:", error);
      toast.error("Failed to get AI recommendations");
      return [];
    }
  },

  // Get schedule suggestions
  getScheduleSuggestions: async (
    courses: any[],
    existingSchedule: any[] = []
  ): Promise<AIScheduleSuggestion[]> => {
    try {
      // Create a prompt with course and existing schedule information
      const coursesInfo = courses.map(c => 
        `Course: ${c.name} (${c.code}), Total hours needed per week: ~${Math.round(c.totalHoursSpent / 4)}`
      ).join("\n");
      
      const scheduleInfo = existingSchedule.length > 0
        ? `Existing schedule:\n${existingSchedule.map(s => 
            `${s.day} at ${s.time}: ${s.courseName} for ${s.duration} minutes`
          ).join('\n')}`
        : "No existing schedule information";

      const prompt = `Based on the following information about my courses and existing schedule, suggest an optimal weekly study schedule. Format your response as a JSON array where each item has courseName, dayOfWeek, startTime (format: "HH:MM"), duration (in minutes), and reason fields.

Courses:
${coursesInfo}

${scheduleInfo}

Please create a balanced schedule that avoids conflicts and distributes study time optimally throughout the week.`;

      const response = await aiService.callOpenRouter(prompt);
      
      // Parse JSON from the response, similar to above
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                         response.match(/```\n([\s\S]*?)\n```/) ||
                         response.match(/\[([\s\S]*?)\]/);
                         
      const jsonText = jsonMatch ? jsonMatch[1] : response;
      let suggestions: AIScheduleSuggestion[] = [];
      
      try {
        suggestions = JSON.parse(jsonText.includes('[') ? jsonText : `[${jsonText}]`);
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        throw new Error("Failed to parse AI schedule data");
      }
      
      return suggestions;
    } catch (error) {
      console.error("Error getting AI schedule suggestions:", error);
      toast.error("Failed to get AI schedule suggestions");
      return [];
    }
  },

  // Get task prioritization suggestions
  getPrioritizedTasks: async (
    tasks: any[]
  ): Promise<AIPrioritizedTask[]> => {
    try {
      // Create a prompt with task information
      const tasksInfo = tasks.map(t => 
        `Task: ${t.title} for ${t.course.name}, Due: ${t.due}, Current Priority: ${t.priority}, Est. time: ${t.estimatedTime}h, Completed: ${t.completed}`
      ).join("\n");

      const prompt = `Based on the following task information, help me prioritize my tasks. Consider deadlines, estimated time required, and current priority levels. Format your response as a JSON array where each item has taskId, taskTitle, priority (1-10 scale, with 10 being highest priority), and reasoning fields.

Tasks:
${tasksInfo}

Please provide a clear prioritization based on urgency, importance, and workload balance.`;

      const response = await aiService.callOpenRouter(prompt);
      
      // Parse JSON from the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                         response.match(/```\n([\s\S]*?)\n```/) ||
                         response.match(/\[([\s\S]*?)\]/);
                         
      const jsonText = jsonMatch ? jsonMatch[1] : response;
      let prioritizedTasks: AIPrioritizedTask[] = [];
      
      try {
        prioritizedTasks = JSON.parse(jsonText.includes('[') ? jsonText : `[${jsonText}]`);
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        throw new Error("Failed to parse AI prioritization data");
      }
      
      return prioritizedTasks;
    } catch (error) {
      console.error("Error getting AI task prioritization:", error);
      toast.error("Failed to get AI task prioritization");
      return [];
    }
  }
};
