
import React from "react";

interface DashboardGreetingProps {
  userName?: string;
  taskCount?: number; // Add taskCount prop
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ 
  userName = "Student",
  taskCount = 0  // Add default value
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Hello, {userName}</h1>
      <p className="text-muted-foreground">
        You have {taskCount > 0 ? `${taskCount} pending tasks` : 'no pending tasks'} today
      </p>
    </div>
  );
};

export default DashboardGreeting;
