
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleCourses } from "@/features/courses/coursesData";
import { sampleTasks } from "@/features/tasks/taskUtils";
import { DashboardGreeting, DashboardContent, TaskProgress } from "@/components/dashboard";
import { Course } from "@/components/CourseCard";
import { useMediaQuery } from "@/hooks/use-mobile";

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
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Statistics for the dashboard
  const [studyStats, setStudyStats] = useState<StudyStats>({
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

  // Sample tasks for task list
  const tasks = sampleTasks.filter(task => !task.completed).slice(0, 5);
  
  // For managing task progress simulations
  const [taskProgress, setTaskProgress] = useState(84);
  const [studyTime, setStudyTime] = useState(24.5);
  
  // Simulate loading analytics data from an API
  useEffect(() => {
    // In a real app, you'd fetch this data from your backend
    const fetchAnalytics = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // This would be data returned from the API
        const analyticsData = {
          totalStudyTime: 157.5,
          weeklyStudyTime: 24.5,
          totalTasks: 45,
          completedTasks: 38,
          currentStreak: 12,
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
        };
        
        // Update state with fetched data
        setStudyStats({
          totalHours: analyticsData.totalStudyTime,
          weeklyHours: analyticsData.weeklyStudyTime,
          totalTasks: analyticsData.totalTasks,
          completedTasks: analyticsData.completedTasks,
          streak: analyticsData.currentStreak,
          courseDistribution: analyticsData.courseDistribution,
          weeklyData: analyticsData.weeklyData
        });
        
        setTaskProgress(Math.round((analyticsData.completedTasks / analyticsData.totalTasks) * 100));
        setStudyTime(analyticsData.weeklyStudyTime);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    
    fetchAnalytics();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5">
        <DashboardGreeting userName="Alex" taskCount={tasks.length} />
        
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
                +2.5 hours from last week
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
              <TaskProgress value={taskProgress} />
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
          courses={courses} 
          tasks={tasks} 
          weeklyData={studyStats.weeklyData}
          courseDistribution={studyStats.courseDistribution}
          totalTasks={studyStats.totalTasks}
          completedTasks={studyStats.completedTasks}
          streak={studyStats.streak}
        />
      </div>
    </div>
  );
};

export default Dashboard;
