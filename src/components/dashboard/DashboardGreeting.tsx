
import React from "react";

interface DashboardGreetingProps {
  userName?: string;
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ 
  userName = "Student" 
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Hello, {userName}</h1>
      <p className="text-muted-foreground">Here's an overview of your study progress</p>
    </div>
  );
};

export default DashboardGreeting;
