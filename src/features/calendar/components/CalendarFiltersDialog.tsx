
import React from "react";
import { Course } from "@/components/CourseCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookOpen, CheckSquare, ClipboardList, Clock } from "lucide-react";

interface CalendarFiltersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  selectedCourses: string[];
  eventTypeFilters: string[];
  onToggleCourseFilter: (courseId: string) => void;
  onToggleEventTypeFilter: (type: string) => void;
  onResetFilters: () => void;
}

const CalendarFiltersDialog: React.FC<CalendarFiltersDialogProps> = ({
  isOpen,
  onOpenChange,
  courses,
  selectedCourses,
  eventTypeFilters,
  onToggleCourseFilter,
  onToggleEventTypeFilter,
  onResetFilters
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calendar Filters</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="text-sm font-medium mb-2">Event Types</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-classes" 
                checked={eventTypeFilters.includes('class')} 
                onCheckedChange={() => onToggleEventTypeFilter('class')}
              />
              <Label htmlFor="filter-classes" className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Classes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-tasks" 
                checked={eventTypeFilters.includes('task')} 
                onCheckedChange={() => onToggleEventTypeFilter('task')}
              />
              <Label htmlFor="filter-tasks" className="flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4" /> Tasks
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-completed" 
                checked={eventTypeFilters.includes('completed')} 
                onCheckedChange={() => onToggleEventTypeFilter('completed')}
              />
              <Label htmlFor="filter-completed" className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" /> Completed Tasks
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-sessions" 
                checked={eventTypeFilters.includes('session')} 
                onCheckedChange={() => onToggleEventTypeFilter('session')}
              />
              <Label htmlFor="filter-sessions" className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Study Sessions
              </Label>
            </div>
          </div>
        
          <Separator className="my-4" />
        
          <h3 className="text-sm font-medium mb-2">Courses</h3>
          <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2">
            {courses.map(course => (
              <div key={course.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`filter-course-${course.id}`} 
                  checked={selectedCourses.includes(course.id)} 
                  onCheckedChange={() => onToggleCourseFilter(course.id)}
                />
                <Label htmlFor={`filter-course-${course.id}`} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full bg-${course.color}-500`}></div>
                  {course.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filters
          </Button>
          <DialogClose asChild>
            <Button>Apply</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarFiltersDialog;
