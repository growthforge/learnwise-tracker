
import React, { useState } from "react";
import { toast } from "sonner";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardContent from "@/components/dashboard/DashboardContent";
import StatsOverview from "@/components/StatsOverview";
import { Task } from "@/components/TaskList";
import { sampleCourses } from "@/features/courses";

const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete ML Assignment 3",
    course: {
      id: "course-1",
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
      id: "course-4",
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
      id: "course-3",
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

const sampleStats = {
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

  const handleGenerateDetailedPlan = (recommendation: any) => {
    toast(`Study Plan for ${recommendation.courseName}`, {
      description: `A detailed study plan is being generated for ${recommendation.recommendedHours} hours of focused study.`,
    });
    
    setTimeout(() => {
      toast.success("Detailed study plan generated!", {
        description: "Check your tasks for the new plan."
      });
    }, 2000);
  };

  return (
    <>
      <DashboardGreeting />
      
      <DashboardContent 
        courses={sampleCourses}
        tasks={tasks}
        stats={sampleStats}
        onTaskToggle={handleTaskToggle}
        onSessionComplete={handleSessionComplete}
        onGenerateDetailedPlan={handleGenerateDetailedPlan}
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">Study Analytics</h2>
        <StatsOverview stats={sampleStats} />
      </div>
    </>
  );
};

export default Dashboard;
