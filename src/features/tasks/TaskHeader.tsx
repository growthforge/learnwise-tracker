
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskHeaderProps {
  onAddTaskClick: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ onAddTaskClick }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tasks & Assignments</h1>
        <p className="text-muted-foreground">Manage your tasks and assignments for all courses</p>
      </div>
      <Button onClick={onAddTaskClick}>
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
};

export default TaskHeader;
