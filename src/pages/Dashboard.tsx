
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardGreeting, DashboardContent } from '@/components/dashboard';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    weeklyData: [
      { day: 'Mon', hours: 2 },
      { day: 'Tue', hours: 1.5 },
      { day: 'Wed', hours: 3 },
      { day: 'Thu', hours: 2.5 },
      { day: 'Fri', hours: 1 },
      { day: 'Sat', hours: 0.5 },
      { day: 'Sun', hours: 0 }
    ],
    totalTasks: 12,
    completedTasks: 5,
    streak: 5
  });
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user?.id)
          .single();

        if (profileData) {
          const name = `${profileData.first_name} ${profileData.last_name}`.trim();
          setUserName(name || 'Student');
        }

        // Fetch courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('user_id', user?.id);
          
        if (coursesData) {
          setCourses(coursesData.map(course => ({
            id: course.id,
            name: course.name,
            code: course.code,
            professor: course.professor || '',
            color: course.color,
            progress: course.progress || 0,
            upcoming: course.upcoming_deadlines || 0
          })));
        }

        // Fetch tasks
        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*, courses(name, code, color)')
          .eq('user_id', user?.id)
          .order('due_date', { ascending: true })
          .limit(5);

        if (tasksData) {
          setTasks(tasksData.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            course: {
              id: task.course_id,
              name: task.courses?.name || 'Unknown Course',
              code: task.courses?.code || '',
              color: task.courses?.color || '#6366F1'
            },
            dueDate: task.due_date,
            dueText: task.due_text || '',
            priority: task.priority || 'medium',
            estimatedTime: task.estimated_time || 30,
            completed: task.completed || false
          })));
        }

        // Fetch analytics
        const { data: analyticsData } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', user?.id)
          .single();
          
        if (analyticsData) {
          setStats({
            weeklyData: analyticsData.weekly_data || stats.weeklyData,
            totalTasks: analyticsData.total_tasks || 0,
            completedTasks: analyticsData.completed_tasks || 0,
            streak: analyticsData.streak || 0
          });
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleTaskToggle = async (task) => {
    try {
      // Update task completion status
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);

      if (error) throw error;

      // Update local state
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      ));
      
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSessionComplete = async (sessionData) => {
    try {
      const { courseId, duration, timestamp } = sessionData;
      
      // Create new session record
      await supabase.from('study_sessions').insert({
        user_id: user?.id,
        course_id: courseId,
        title: 'Study Session',
        date: timestamp.toISOString(),
        duration: duration,
        completed: true
      });
      
      // Could also update analytics here
      
    } catch (error) {
      console.error("Error recording study session:", error);
    }
  };

  const handleGenerateDetailedPlan = (recommendation) => {
    // Implementation for AI recommendation handling
    console.log("Generating detailed plan based on:", recommendation);
    // This would integrate with AI services in a full implementation
  };

  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <DashboardGreeting userName={userName} />
      
      {courses.length === 0 && tasks.length === 0 ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to StudyFlow!</h2>
          <p className="mb-4">
            It looks like you're just getting started. Add your first course and tasks to begin tracking your academic progress.
          </p>
          <div className="flex gap-4">
            <a href="/courses" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              Add Courses
            </a>
            <a href="/tasks" className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">
              Add Tasks
            </a>
          </div>
        </Card>
      ) : (
        <DashboardContent
          courses={courses}
          tasks={tasks}
          stats={stats}
          onTaskToggle={handleTaskToggle}
          onSessionComplete={handleSessionComplete}
          onGenerateDetailedPlan={handleGenerateDetailedPlan}
        />
      )}
    </div>
  );
};

export default Dashboard;
