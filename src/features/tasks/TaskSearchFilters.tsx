
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { sampleCourses } from "./taskUtils";

interface TaskSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  courseFilter: string;
  setCourseFilter: (courseId: string) => void;
}

const TaskSearchFilters: React.FC<TaskSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  courseFilter,
  setCourseFilter
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tasks..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <div className="w-48">
          <Select 
            value={courseFilter} 
            onValueChange={setCourseFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {sampleCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default TaskSearchFilters;
