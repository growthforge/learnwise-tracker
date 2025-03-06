import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Calendar, CheckSquare, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskList, { Task } from "@/components/TaskList";
import { toast } from "sonner";

// Sample data
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
  {
    id: "task-4",
    title: "Review lecture notes",
    course: {
      name: "Data Structures",
      code: "CS-201",
      color: "green",
    },
    due: "Tomorrow at 9:00 AM",
    completed: false,
    priority: "medium",
    estimatedTime: 1.5,
  },
  {
    id: "task-5",
    title: "Submit Psychology Essay",
    course: {
      name: "Introduction to Psychology",
      code: "PSYC-101",
      color: "red",
    },
    due: "Next Wednesday",
    completed: false,
    priority: "low",
    estimatedTime: 5,
  },
  {
    id: "task-6",
    title: "Algorithms Problem Set 2",
    course: {
      name: "Algorithms",
      code: "CS-301",
      color: "sky",
    },
    due: "Friday",
    completed: true,
    priority: "high",
    estimatedTime: 4,
  },
  {
    id: "task-7",
    title: "Economics Quiz 1",
    course: {
      name: "Economics 101",
      code: "ECON-101",
      color: "amber",
    },
    due: "Last Monday",
    completed: true,
    priority: "medium",
    estimatedTime: 2,
  },
];

const Tasks: React.FC = () => {
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
  
  const handleTaskClick = (task: Task) => {
    // In a real app, this would open a task detail view or editor
    toast.info("Task details", {
      description: `View details for: ${task.title}`,
    });
  };
  
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks & Assignments</h1>
          <p className="text-muted-foreground">Manage your tasks and assignments for all courses</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <div className="w-48">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="cs433">Machine Learning</SelectItem>
                <SelectItem value="cs201">Data Structures</SelectItem>
                <SelectItem value="math304">Linear Algebra</SelectItem>
                <SelectItem value="econ101">Economics 101</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

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
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <TaskList
            tasks={completedTasks}
            title="Completed Tasks"
            emptyMessage="No completed tasks"
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <TaskList
            tasks={tasks}
            title="All Tasks"
            emptyMessage="No tasks available"
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>
      </Tabs>

      <div className="bg-secondary/50 border subtle-border p-4 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Total Estimated Work Time</h3>
            <p className="text-sm text-muted-foreground mb-2">
              You have approximately <span className="font-medium">{pendingTasks.reduce((acc, task) => acc + (task.estimatedTime || 0), 0)} hours</span> of work remaining for pending tasks.
            </p>
            <p className="text-xs text-muted-foreground">
              The AI assistant recommends allocating at least 2 hours today to work on high-priority assignments.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
