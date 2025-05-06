import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  professor?: string;
  progress: number;
  nextClass?: Date;
  upcomingDeadlines: number;
  totalHours?: number; // Total study hours spent
  totalHoursSpent?: number; // Added this to fix the type error
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="hover-card">
      <CardContent className="p-6" style={{ backgroundColor: course.color, color: 'white' }}>
        <h3 className="text-lg font-semibold">{course.name}</h3>
        <p className="text-sm">{course.code}</p>
        {course.professor && <p className="text-sm mt-1">Professor: {course.professor}</p>}
        {course.nextClass && (
          <p className="text-xs mt-2">
            Next class:{' '}
            {formatDistanceToNow(course.nextClass, {
              addSuffix: true,
            })}
          </p>
        )}
        <div className="mt-4 flex justify-between items-center">
          <span>Progress: {course.progress}%</span>
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
