
import React, { useState } from "react";
import { Task } from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { sampleTasks, sampleCourses } from "@/features/tasks/taskUtils";
import TaskHeader from "@/features/tasks/TaskHeader";
import TaskSearchFilters from "@/features/tasks/TaskSearchFilters";
import TaskTabs from "@/features/tasks/TaskTabs";
import WorkTimeSummary from "@/features/tasks/WorkTimeSummary";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>(undefined);
  
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
    // Show task details
    toast.info(task.title, {
      description: task.description || "No additional details available",
    });
  };
  
  const handleAddEditTask = (task: Task) => {
    if (taskToEdit) {
      // Update existing task
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      toast.success("Task updated successfully");
    } else {
      // Add new task
      setTasks([task, ...tasks]);
      toast.success("Task added successfully");
    }
    setTaskToEdit(undefined);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
    setTaskToDelete(undefined);
  };
  
  const openEditForm = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };
  
  const filteredTasks = tasks
    .filter(task => {
      // Apply search term filter
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply course filter
      if (courseFilter !== "all" && task.course.id !== courseFilter) {
        return false;
      }
      
      return true;
    });
  
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  
  return (
    <>
      <TaskHeader onAddTaskClick={() => {
        setTaskToEdit(undefined);
        setIsFormOpen(true);
      }} />

      <TaskSearchFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
      />

      <TaskTabs 
        filteredTasks={filteredTasks}
        onTaskToggle={handleTaskToggle}
        onTaskClick={handleTaskClick}
        onTaskEdit={openEditForm}
        onTaskDelete={setTaskToDelete}
      />

      <WorkTimeSummary pendingTasks={pendingTasks} />

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setTaskToEdit(undefined);
          }}
          onSave={handleAddEditTask}
          initialTask={taskToEdit}
          courses={sampleCourses}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!taskToDelete} 
        onOpenChange={(open) => !open && setTaskToDelete(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{taskToDelete?.title}" and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleDeleteTask(taskToDelete?.id || '')}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Tasks;
