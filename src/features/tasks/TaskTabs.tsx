
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckSquare, Calendar } from "lucide-react";
import TaskList, { Task } from "@/components/TaskList";

interface TaskTabsProps {
  filteredTasks: Task[];
  onTaskToggle: (task: Task) => void;
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({
  filteredTasks,
  onTaskToggle,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
}) => {
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <Tabs defaultValue="pending" className="mb-8">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="pending" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Pending</span>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          <span>Completed</span>
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>All Tasks</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="mt-6">
        <TaskList
          tasks={pendingTasks}
          title="Pending Tasks"
          emptyMessage="No pending tasks"
          onTaskToggle={onTaskToggle}
          onTaskClick={onTaskClick}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
        />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        <TaskList
          tasks={completedTasks}
          title="Completed Tasks"
          emptyMessage="No completed tasks"
          onTaskToggle={onTaskToggle}
          onTaskClick={onTaskClick}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
        />
      </TabsContent>
      
      <TabsContent value="all" className="mt-6">
        <TaskList
          tasks={filteredTasks}
          title="All Tasks"
          emptyMessage="No tasks available"
          onTaskToggle={onTaskToggle}
          onTaskClick={onTaskClick}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TaskTabs;
