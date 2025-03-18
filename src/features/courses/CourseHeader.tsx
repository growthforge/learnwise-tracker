
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CourseHeaderProps {
  onAddCourse: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ onAddCourse }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Courses</h1>
        <p className="text-muted-foreground">Manage your courses and track your progress</p>
      </div>
      <Button className="self-start sm:self-center" onClick={onAddCourse}>
        <Plus className="w-4 h-4 mr-2" />
        Add Course
      </Button>
    </div>
  );
};

export default CourseHeader;
