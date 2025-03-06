
import React, { useState } from "react";
import Layout from "@/components/Layout";
import CourseCard, { Course } from "@/components/CourseCard";
import TaskList, { Task } from "@/components/TaskList";
import StudySession from "@/components/StudySession";
import StatsOverview, { StudyStats } from "@/components/StatsOverview";
import { CheckSquare, ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Sample data for demonstration purposes
const sampleCourses: Course[] = [
  {
    id: "course-1",
    name: "Machine Learning",
    code: "CS-433",
    professor: "Dr. Smith",
    color: "blue",
    progress: 65,
    upcomingDeadlines: 2,
    totalHoursSpent: 24,
    nextClass: {
      day: "Wednesday",
      time: "10:00 AM",
    },
  },
  {
    id: "course-2",
    name: "Data Structures",
    code: "CS-201",
    professor: "Dr. Johnson",
    color: "green",
    progress: 48,
    upcomingDeadlines: 1,
    totalHoursSpent: 18,
  },
  {
    id: "course-3",
    name: "Linear Algebra",
    code: "MATH-304",
    professor: "Dr. Williams",
    color: "purple",
    progress: 72,
    upcomingDeadlines: 3,
    totalHoursSpent: 20,
    nextClass: {
      day: "Thursday",
      time: "2:00 PM",
    },
  },
  {
    id: "course-4",
    name: "Economics 101",
    code: "ECON-101",
    professor: "Dr. Davis",
    color: "amber",
    progress: 30,
    upcomingDeadlines: 1,
    totalHoursSpent: 12,
  },
];

const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete ML Assignment 3",
    course: {
      name: "Machine Learning",
      code: "CS-433",
      color: "blue",
    },
    due: "Tomorrow at 11:59 PM",
    completed: false,
    priority: "high",
    estimatedTime: 3,
  },
  {
    id: "task-2",
    title: "Read Chapter 5",
    course: {
      name: "Economics 101",
      code: "ECON-101",
      color: "amber",
    },
    due: "Friday at 6:00 PM",
    completed: false,
    priority: "medium",
    estimatedTime: 2,
  },
  {
    id: "task-3",
    title: "Prepare for Linear Algebra Quiz",
    course: {
      name: "Linear Algebra",
      code: "MATH-304",
      color: "purple",
    },
    due: "Next Monday",
    completed: false,
    priority: "high",
    estimatedTime: 4,
  },
];

const sampleStats: StudyStats = {
  totalHours: 124,
  weeklyHours: 18,
  totalTasks: 35,
  completedTasks: 27,
  streak: 12,
  weeklyData: [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 4.5 },
    { day: "Thu", hours: 2.0 },
    { day: "Fri", hours: 3.5 },
    { day: "Sat", hours: 1.5 },
    { day: "Sun", hours: 1.0 },
  ],
  courseDistribution: [
    { name: "ML", hours: 24, color: "blue" },
    { name: "DS", hours: 18, color: "green" },
    { name: "LA", hours: 20, color: "purple" },
    { name: "Econ", hours: 12, color: "amber" },
  ],
};

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  const handleTaskToggle = (taskToToggle: Task) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskToToggle.id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    
    toast(taskToToggle.completed ? "Task marked as incomplete" : "Task completed!", {
      description: taskToToggle.title,
    });
  };

  const handleSessionComplete = (sessionData: { courseId: string; duration: number; timestamp: Date }) => {
    const course = sampleCourses.find(c => c.id === sessionData.courseId);
    
    toast("Study session completed!", {
      description: `You studied ${course?.name} for ${Math.floor(sessionData.duration / 60)} minutes.`,
    });
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hello, Student</h1>
        <p className="text-muted-foreground">Here's an overview of your study progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="col-span-2 space-y-6">
          <Card className="hover-card glass-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">AI Study Recommendation</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Based on your upcoming deadlines and study patterns, here's what you should focus on today:
                  </p>
                  <div className="bg-secondary p-3 rounded-lg mb-4">
                    <div className="flex gap-2 items-center text-sm font-medium mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Focus on Machine Learning for 2.5 hours today</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your assignment is due tomorrow and you typically need 3 hours to complete similar assignments.
                    </p>
                  </div>
                  <Button size="sm" className="mt-2">
                    Generate Detailed Plan <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <TaskList
            tasks={tasks.filter(t => !t.completed).slice(0, 3)}
            title="Priority Tasks"
            emptyMessage="No tasks due soon"
            showViewAll={true}
            onTaskToggle={handleTaskToggle}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleCourses.slice(0, 2).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <StudySession 
            courses={sampleCourses} 
            onSessionComplete={handleSessionComplete}
          />
          
          <Card className="hover-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Tasks Progress</h3>
                <div className="bg-green-100 p-1.5 rounded-full dark:bg-green-900/30">
                  <CheckSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completed</span>
                    <span className="font-medium">{sampleStats.completedTasks}/{sampleStats.totalTasks}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{width: `${(sampleStats.completedTasks / sampleStats.totalTasks) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Study Streak</span>
                    <span className="font-medium">{sampleStats.streak} days</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2.5 flex-1 rounded-full ${
                          i < 5 ? "bg-primary" : "bg-secondary"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                <a href="/analytics" className="flex items-center justify-between hover:text-primary transition-colors">
                  <span>View detailed analytics</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">Study Analytics</h2>
        <StatsOverview stats={sampleStats} />
      </div>
    </Layout>
  );
};

export default Dashboard;
