
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface TaskCourseFieldProps {
  value: string;
  onChange: (value: string) => void;
  courses: Course[];
}

const TaskCourseField: React.FC<TaskCourseFieldProps> = ({ value, onChange, courses }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="course" className="text-sm font-medium">Course</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          {courses.map(course => (
            <SelectItem key={course.id} value={course.id}>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full bg-${course.color}-500`}></div>
                <span>{course.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskCourseField;
