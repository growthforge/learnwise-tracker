
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Define a type for the nextClass property
export interface CourseNextClass {
  day: string;
  time: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  professor?: string;
  progress?: number;
  nextClass?: CourseNextClass | Date;
  upcomingDeadlines?: number;
  totalHours?: number;
  totalHoursSpent?: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Format next class time
  const getNextClassText = () => {
    if (!course.nextClass) return "No upcoming classes";
    
    // Handle both string format and Date object
    if (typeof course.nextClass === 'object' && course.nextClass instanceof Date) {
      const date = course.nextClass;
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `${day} at ${time}`;
    } else if (typeof course.nextClass === 'object' && 'day' in course.nextClass && 'time' in course.nextClass) {
      // Handle custom CourseNextClass format
      return `${course.nextClass.day} at ${course.nextClass.time}`;
    }
    
    return "Schedule unavailable";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("pb-2", `bg-${course.color}-500 text-white`)}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{course.name}</h3>
            <p className="text-sm opacity-90">{course.code}</p>
          </div>
          {course.upcomingDeadlines !== undefined && course.upcomingDeadlines > 0 && (
            <div className="bg-white text-black text-xs px-2 py-1 rounded-full">
              {course.upcomingDeadlines} deadlines
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {course.progress !== undefined && (
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
        
        {course.professor && (
          <p className="text-sm text-muted-foreground mb-2">
            Professor: {course.professor}
          </p>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 py-2">
        <p className="text-xs text-muted-foreground w-full">
          Next class: {getNextClassText()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
