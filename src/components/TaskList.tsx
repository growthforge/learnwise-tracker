
import React from "react";
import { CheckCircle2, Circle, Clock, CalendarClock, ArrowUpRight, Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Task {
  id: string;
  title: string;
  course: {
    id: string;
    name: string;
    code: string;
    color: string;
  };
  due: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  estimatedTime?: number;
  description?: string;
}

interface TaskListProps {
  tasks: Task[];
  title: string;
  emptyMessage?: string;
  showViewAll?: boolean;
  onTaskClick?: (task: Task) => void;
  onTaskToggle?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
  className?: string;
}

const priorityClasses = {
  high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30",
  medium: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30",
  low: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30",
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  title,
  emptyMessage = "No tasks available",
  showViewAll = false,
  onTaskClick,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {showViewAll && tasks.length > 0 && (
          <a href="/tasks" className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-sm">{emptyMessage}</div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "p-3 rounded-lg border subtle-border transition-all",
                task.completed ? "bg-muted/50" : "bg-card",
                onTaskClick && "hover:border-primary/40"
              )}
              onClick={() => onTaskClick && onTaskClick(task)}
            >
              <div className="flex items-start gap-3">
                <button
                  className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskToggle && onTaskToggle(task);
                  }}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className={cn("font-medium text-sm", task.completed && "line-through text-muted-foreground")}>
                      {task.title}
                    </h4>
                    <div className={cn("text-xs px-2 py-0.5 rounded border", priorityClasses[task.priority])}>
                      {task.priority}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className={`text-xs px-1.5 py-0.5 rounded bg-${task.course.color}-500/20 text-${task.course.color}-700 dark:text-${task.course.color}-300`}>
                      {task.course.code}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {task.estimatedTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.estimatedTime}h</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <CalendarClock className="w-3.5 h-3.5" />
                        <span>{task.due}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Task action buttons */}
                  {(onTaskEdit || onTaskDelete) && (
                    <div className="flex justify-end gap-2 mt-2">
                      {onTaskEdit && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskEdit(task);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onTaskDelete && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskDelete(task);
                          }}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
