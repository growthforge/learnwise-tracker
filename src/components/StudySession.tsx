
import React, { useState, useEffect } from "react";
import { Play, Pause, SkipForward, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface StudySessionProps {
  courses: Course[];
  onSessionComplete?: (sessionData: {
    courseId: string;
    duration: number;
    timestamp: Date;
  }) => void;
  className?: string;
}

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const StudySession: React.FC<StudySessionProps> = ({ 
  courses,
  onSessionComplete,
  className 
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [targetTime, setTargetTime] = useState<number>(25 * 60); // 25 minutes default
  
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          
          if (newTime >= targetTime) {
            setIsActive(false);
            if (onSessionComplete && selectedCourseId) {
              onSessionComplete({
                courseId: selectedCourseId,
                duration: targetTime,
                timestamp: new Date()
              });
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else if (!isActive && time !== 0 && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, targetTime, onSessionComplete, selectedCourseId]);
  
  const handleStartPause = () => {
    if (!selectedCourseId) return;
    setIsActive(!isActive);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };
  
  const progress = (time / targetTime) * 100;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Study Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              disabled={isActive}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center">
                      <div className={`mr-2 w-2 h-2 rounded-full bg-${course.color}-500`} />
                      {course.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <Select
              value={targetTime.toString()}
              onValueChange={(value) => setTargetTime(parseInt(value))}
              disabled={isActive}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1500">25 minutes</SelectItem>
                <SelectItem value="3000">50 minutes</SelectItem>
                <SelectItem value="5400">1.5 hours</SelectItem>
                <SelectItem value="7200">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-center py-4 md:py-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold tabular-nums mb-2">{formatTime(time)}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{selectedCourse ? `Studying ${selectedCourse.name}` : "Select a course to begin"}</div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!selectedCourseId || time === 0}
              size="sm"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={handleStartPause}
              disabled={!selectedCourseId}
              className={isActive ? "bg-amber-600 hover:bg-amber-700" : ""}
              size="sm"
            >
              {isActive ? (
                <><Pause className="w-4 h-4 mr-2" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Start</>
              )}
            </Button>
          </div>
          
          {selectedCourse && (
            <div className="text-xs text-center text-muted-foreground mt-2 md:mt-4">
              Tip: Stay focused and avoid distractions for optimal learning.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySession;
