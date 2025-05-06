
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardGreetingProps {
  userName?: string;
  taskCount?: number;
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ 
  userName,
  taskCount = 0
}) => {
  const { userProfile } = useAuth();
  const displayName = userProfile?.firstName || userName || "Student";
  
  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {displayName}</h1>
      <p className="text-muted-foreground">
        You have {taskCount > 0 ? `${taskCount} pending ${taskCount === 1 ? 'task' : 'tasks'}` : 'no pending tasks'} today
      </p>
    </div>
  );
};

export default DashboardGreeting;
