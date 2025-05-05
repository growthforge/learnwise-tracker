
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, ArrowRight } from "lucide-react";

interface TaskProgressProps {
  completedTasks: number;
  totalTasks: number;
  streak: number;
  value?: number; // Add value prop for direct progress display
}

const TaskProgress: React.FC<TaskProgressProps> = ({ 
  completedTasks, 
  totalTasks, 
  streak,
  value // Add value prop
}) => {
  // Calculate progress percentage if value is not provided
  const progressPercentage = value !== undefined 
    ? value 
    : totalTasks > 0 
      ? (completedTasks / totalTasks) * 100
      : 0;

  return (
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
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{width: `${progressPercentage}%`}}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Study Streak</span>
              <span className="font-medium">{streak} days</span>
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
  );
};

export default TaskProgress;
