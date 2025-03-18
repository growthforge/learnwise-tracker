
import React from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CourseCard, { Course } from "@/components/CourseCard";

interface CourseListProps {
  courses: Course[];
  onAddCourse: () => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onAddCourse }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
      <div className="border border-dashed rounded-lg hover-card flex flex-col items-center justify-center p-6 h-64 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Add a New Course</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track assignments, deadlines, and study hours for each course.
        </p>
        <Button variant="outline" size="sm" onClick={onAddCourse}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>
    </div>
  );
};

export default CourseList;
