
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleCourses } from "@/features/courses/coursesData";
import { sampleTasks } from "@/features/tasks/taskUtils";
import { DashboardGreeting, DashboardContent } from "@/components/dashboard";
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";
import { useMediaQuery } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StudyStats {
  totalHours: number;
  weeklyHours: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
  courseDistribution: { id: string; name: string; hours: number; color: string }[];
  weeklyData: { day: string; hours: number }[];
}

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Statistics for the dashboard
  const [studyStats, setStudyStats] = useState<StudyStats>({
    totalHours: 0,
    weeklyHours: 0,
    totalTasks: 0,
    completedTasks: 0,
    streak: 0,
    courseDistribution: [],
    weeklyData: [
      { day: "Mon", hours: 0 },
      { day: "Tue", hours: 0 },
      { day: "Wed", hours: 0 },
      { day: "Thu", hours: 0 },
      { day: "Fri", hours: 0 },
      { day: "Sat", hours: 0 },
      { day: "Sun", hours: 0 },
    ]
  });

  // Fetch data from Supabase when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Use sample data if user is not authenticated
          setCourses(sampleCourses);
          setTasks(sampleTasks);
          
          setStudyStats({
            totalHours: 157.5,
            weeklyHours: 24.5,
            totalTasks: 45,
            completedTasks: 38,
            streak: 12,
            courseDistribution: [
              { id: "course-1", name: "Machine Learning", hours: 45, color: "blue" },
              { id: "course-2", name: "Data Structures", hours: 32, color: "green" },
              { id: "course-3", name: "Linear Algebra", hours: 28, color: "purple" },
              { id: "course-4", name: "Economics 101", hours: 18, color: "amber" },
              { id: "course-5", name: "Psychology", hours: 12, color: "red" },
              { id: "course-6", name: "Algorithms", hours: 22.5, color: "sky" },
            ],
            weeklyData: [
              { day: "Mon", hours: 3.5 },
              { day: "Tue", hours: 2.0 },
              { day: "Wed", hours: 4.5 },
              { day: "Thu", hours: 3.0 },
              { day: "Fri", hours: 5.5 },
              { day: "Sat", hours: 2.0 },
              { day: "Sun", hours: 4.0 },
            ]
          });
          setIsLoading(false);
          return;
        }
        
        // Fetch courses from Supabase
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*');
        
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          toast.error('Failed to load courses');
          // Use sample data as fallback
          setCourses(sampleCourses);
        } else if (coursesData && coursesData.length > 0) {
          const mappedCourses: Course[] = coursesData.map(course => ({
            id: course.id,
            name: course.name,
            code: course.code,
            color: course.color,
            professor: course.professor || '',
            progress: course.progress || 0,
            nextClass: course.next_class ? new Date(course.next_class) : undefined,
            upcomingDeadlines: course.upcoming_deadlines || 0,
            totalHours: course.total_hours_spent || 0,
            totalHoursSpent: course.total_hours_spent || 0
          }));
          setCourses(mappedCourses);
        } else {
          // No courses found in database, use sample data
          setCourses(sampleCourses);
        }
        
        // Fetch tasks from Supabase
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('due_date', { ascending: true });
        
        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
          toast.error('Failed to load tasks');
          // Use sample data as fallback
          setTasks(sampleTasks);
        } else if (tasksData && tasksData.length > 0) {
          const mappedTasks: Task[] = tasksData.map(task => ({
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
            estimatedTime: task.estimated_time || 0,
          }));
          setTasks(mappedTasks);
        } else {
          // No tasks found in database, use sample data
          setTasks(sampleTasks);
        }
        
        // Fetch analytics data from Supabase
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics')
          .select('*')
          .single();
        
        if (analyticsError && analyticsError.code !== 'PGRST116') {
          console.error('Error fetching analytics:', analyticsError);
          toast.error('Failed to load analytics data');
          
          // Use sample stats as fallback
          setStudyStats({
            totalHours: 157.5,
            weeklyHours: 24.5,
            totalTasks: sampleTasks.length,
            completedTasks: sampleTasks.filter(t => t.completed).length,
            streak: 12,
            courseDistribution: [
              { id: "course-1", name: "Machine Learning", hours: 45, color: "blue" },
              { id: "course-2", name: "Data Structures", hours: 32, color: "green" },
              { id: "course-3", name: "Linear Algebra", hours: 28, color: "purple" },
              { id: "course-4", name: "Economics 101", hours: 18, color: "amber" },
              { id: "course-5", name: "Psychology", hours: 12, color: "red" },
              { id: "course-6", name: "Algorithms", hours: 22.5, color: "sky" },
            ],
            weeklyData: [
              { day: "Mon", hours: 3.5 },
              { day: "Tue", hours: 2.0 },
              { day: "Wed", hours: 4.5 },
              { day: "Thu", hours: 3.0 },
              { day: "Fri", hours: 5.5 },
              { day: "Sat", hours: 2.0 },
              { day: "Sun", hours: 4.0 },
            ]
          });
        } else if (analyticsData) {
          // Create a safe parse function to handle potentially invalid JSON data
          const safeParseJson = (jsonString: string | null, fallback: any) => {
            if (!jsonString) return fallback;
            try {
              return JSON.parse(jsonString);
            } catch (e) {
              console.error('Error parsing JSON:', e);
              return fallback;
            }
          };

          // Initialize default values for the analytics data
          const defaultDistribution = [
            { id: "course-1", name: "Machine Learning", hours: 45, color: "blue" },
            { id: "course-2", name: "Data Structures", hours: 32, color: "green" },
          ];

          const defaultWeeklyData = [
            { day: "Mon", hours: 0 },
            { day: "Tue", hours: 0 },
            { day: "Wed", hours: 0 },
            { day: "Thu", hours: 0 },
            { day: "Fri", hours: 0 },
            { day: "Sat", hours: 0 },
            { day: "Sun", hours: 0 },
          ];
          
          // Extract and safely parse the analytics data
          const courseDistribution = Array.isArray(analyticsData.course_distribution) 
            ? analyticsData.course_distribution 
            : safeParseJson(analyticsData.course_distribution as string, defaultDistribution);
          
          const weeklyData = Array.isArray(analyticsData.weekly_data)
            ? analyticsData.weekly_data
            : safeParseJson(analyticsData.weekly_data as string, defaultWeeklyData);

          setStudyStats({
            totalHours: analyticsData.total_hours || 0,
            weeklyHours: analyticsData.weekly_hours || 0,
            totalTasks: analyticsData.total_tasks || 0,
            completedTasks: analyticsData.completed_tasks || 0,
            streak: analyticsData.streak || 0,
            courseDistribution: courseDistribution || defaultDistribution,
            weeklyData: weeklyData || defaultWeeklyData
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        // Use sample data as fallback
        setCourses(sampleCourses);
        setTasks(sampleTasks);
        
        setStudyStats({
          totalHours: 157.5,
          weeklyHours: 24.5,
          totalTasks: 45,
          completedTasks: 38,
          streak: 12,
          courseDistribution: [
            { id: "course-1", name: "Machine Learning", hours: 45, color: "blue" },
            { id: "course-2", name: "Data Structures", hours: 32, color: "green" },
            { id: "course-3", name: "Linear Algebra", hours: 28, color: "purple" },
            { id: "course-4", name: "Economics 101", hours: 18, color: "amber" },
            { id: "course-5", name: "Psychology", hours: 12, color: "red" },
            { id: "course-6", name: "Algorithms", hours: 22.5, color: "sky" },
          ],
          weeklyData: [
            { day: "Mon", hours: 3.5 },
            { day: "Tue", hours: 2.0 },
            { day: "Wed", hours: 4.5 },
            { day: "Thu", hours: 3.0 },
            { day: "Fri", hours: 5.5 },
            { day: "Sat", hours: 2.0 },
            { day: "Sun", hours: 4.0 },
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTaskToggle = async (task: Task) => {
    try {
      // Update task locally for immediate UI feedback
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
      );
      
      // Update task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);
      
      if (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
        // Revert the local change
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === task.id ? { ...t, completed: task.completed } : t)
        );
      } else {
        toast.success(`Task ${!task.completed ? 'completed' : 'reopened'}`);
        
        // Update analytics
        updateAnalytics(!task.completed);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };
  
  const updateAnalytics = async (taskCompleted: boolean) => {
    try {
      const completedIncrement = taskCompleted ? 1 : -1;
      
      const { data: analyticsData, error: fetchError } = await supabase
        .from('analytics')
        .select('completed_tasks, total_tasks')
        .single();
      
      if (fetchError) {
        console.error('Error fetching analytics:', fetchError);
        return;
      }
      
      const { error: updateError } = await supabase
        .from('analytics')
        .update({
          completed_tasks: (analyticsData.completed_tasks || 0) + completedIncrement
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (updateError) {
        console.error('Error updating analytics:', updateError);
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  };
  
  const handleSessionComplete = async (sessionData: { courseId: string; duration: number; timestamp: Date }) => {
    try {
      const course = courses.find(c => c.id === sessionData.courseId);
      
      if (!course) {
        toast.error('Course not found');
        return;
      }
      
      // Create new session entry in Supabase
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          course_id: sessionData.courseId,
          title: `Study Session: ${course.name}`,
          date: sessionData.timestamp.toISOString(),
          duration: sessionData.duration / 60, // Convert seconds to minutes
          completed: true,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) {
        console.error('Error creating study session:', error);
        toast.error('Failed to save study session');
        return;
      }
      
      toast.success('Study session completed!');
      
      // Update course total hours
      const totalHours = course.totalHours || 0;
      const newTotalHours = totalHours + (sessionData.duration / 3600); // Convert seconds to hours
      
      await supabase
        .from('courses')
        .update({
          total_hours_spent: newTotalHours
        })
        .eq('id', course.id);
      
      // Update analytics
      await updateStudyTimeAnalytics(sessionData.duration / 3600); // Convert seconds to hours
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to save study session');
    }
  };
  
  const updateStudyTimeAnalytics = async (hours: number) => {
    try {
      const { data: analyticsData, error: fetchError } = await supabase
        .from('analytics')
        .select('total_hours, weekly_hours, weekly_data')
        .single();
      
      if (fetchError) {
        console.error('Error fetching analytics:', fetchError);
        return;
      }
      
      // Update weekly data
      const today = new Date();
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()];
      
      let weeklyData = analyticsData.weekly_data || [];
      
      // If weekly_data is a string, parse it
      if (typeof weeklyData === 'string') {
        try {
          weeklyData = JSON.parse(weeklyData);
        } catch (e) {
          console.error('Error parsing weekly data:', e);
          weeklyData = studyStats.weeklyData; // Use current state as fallback
        }
      }
      
      if (Array.isArray(weeklyData)) {
        weeklyData = weeklyData.map((day: any) => 
          day.day === dayOfWeek 
            ? { ...day, hours: (day.hours || 0) + hours } 
            : day
        );
      }
      
      const { error: updateError } = await supabase
        .from('analytics')
        .update({
          total_hours: (analyticsData.total_hours || 0) + hours,
          weekly_hours: (analyticsData.weekly_hours || 0) + hours,
          weekly_data: weeklyData
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (updateError) {
        console.error('Error updating analytics:', updateError);
      }
    } catch (error) {
      console.error('Error updating study time analytics:', error);
    }
  };
  
  // Filter tasks to get only pending ones for display
  const pendingTasks = tasks.filter(task => !task.completed).slice(0, 5);
  
  // Calculate progress percentage
  const taskProgress = studyStats.totalTasks > 0 
    ? Math.round((studyStats.completedTasks / studyStats.totalTasks) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5">
        <DashboardGreeting 
          userName="Student" 
          taskCount={pendingTasks.length} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Weekly Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats.weeklyHours} hours</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{(studyStats.weeklyHours - 22).toFixed(1)} hours from last week
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 rounded-tl-full" />
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats.completedTasks}/{studyStats.totalTasks}</div>
              <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{width: `${taskProgress}%`}}
                ></div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 rounded-tl-full" />
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats.streak} days</div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep it up!
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 rounded-tl-full" />
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats.totalHours} hours</div>
              <p className="text-xs text-muted-foreground mt-1">
                Since you started tracking
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 rounded-tl-full" />
            </CardContent>
          </Card>
        </div>
        
        <DashboardContent 
          courses={courses.slice(0, 6)} 
          tasks={pendingTasks} 
          stats={{
            completedTasks: studyStats.completedTasks,
            totalTasks: studyStats.totalTasks,
            streak: studyStats.streak,
            weeklyData: studyStats.weeklyData,
            courseDistribution: studyStats.courseDistribution
          }}
          onTaskToggle={handleTaskToggle}
          onSessionComplete={handleSessionComplete}
          onGenerateDetailedPlan={() => {
            toast.info('AI Study Plan feature is currently in development.');
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
