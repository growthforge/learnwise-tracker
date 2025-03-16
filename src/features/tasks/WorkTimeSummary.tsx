
import React from "react";
import { Clock } from "lucide-react";
import { Task } from "@/components/TaskList";

interface WorkTimeSummaryProps {
  pendingTasks: Task[];
}

const WorkTimeSummary: React.FC<WorkTimeSummaryProps> = ({ pendingTasks }) => {
  const totalEstimatedTime = pendingTasks.reduce((acc, task) => acc + (task.estimatedTime || 0), 0);
  
  return (
    <div className="bg-secondary/50 border subtle-border p-4 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Clock className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Total Estimated Work Time</h3>
          <p className="text-sm text-muted-foreground mb-2">
            You have approximately <span className="font-medium">{totalEstimatedTime} hours</span> of work remaining for pending tasks.
          </p>
          <p className="text-xs text-muted-foreground">
            The AI assistant recommends allocating at least 2 hours today to work on high-priority assignments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkTimeSummary;
