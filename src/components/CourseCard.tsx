
import React from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  color: string;
  progress: number;
  upcomingDeadlines: number;
  totalHoursSpent: number;
  nextClass?: {
    day: string;
    time: string;
  };
}

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, className }) => {
  return (
    <Card className={cn("hover-card overflow-hidden", className)}>
      <div className={`h-1.5 w-full bg-${course.color}-500`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{course.code}</p>
            <CardTitle>{course.name}</CardTitle>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-${course.color}-500`}>
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="text-sm font-medium">{course.progress}%</div>
        </div>
        <Progress value={course.progress} className="h-1.5 mb-4" />
        
        <div className="flex justify-between mt-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{course.upcomingDeadlines} tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{course.totalHoursSpent}h spent</span>
          </div>
        </div>
        
        {course.nextClass && (
          <div className="mt-4 p-2 bg-secondary rounded-md text-xs">
            <div className="font-medium mb-1">Next class</div>
            <div>{course.nextClass.day} • {course.nextClass.time}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
