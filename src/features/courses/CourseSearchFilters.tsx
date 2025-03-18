
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CourseSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  semesterFilter: string;
  setSemesterFilter: (semester: string) => void;
  onOpenFilters: () => void;
}

const CourseSearchFilters: React.FC<CourseSearchFiltersProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  semesterFilter, 
  setSemesterFilter,
  onOpenFilters
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search courses..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <Select 
            value={semesterFilter} 
            onValueChange={setSemesterFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="fall2023">Fall 2023</SelectItem>
              <SelectItem value="spring2023">Spring 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="w-full sm:w-auto" onClick={onOpenFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default CourseSearchFilters;
