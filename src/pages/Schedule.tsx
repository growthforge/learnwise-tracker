
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CalendarClock, Clock, BookOpen } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";

const Schedule = () => {
  // Sample schedule data
  const scheduleItems = [
    {
      id: 1,
      course: "Machine Learning",
      day: "Monday",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      type: "Lecture",
      location: "Building A, Room 101",
      color: "blue"
    },
    {
      id: 2,
      course: "Data Structures",
      day: "Monday",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      type: "Lab",
      location: "Computer Lab 3",
      color: "green"
    },
    {
      id: 3,
      course: "Linear Algebra",
      day: "Tuesday",
      startTime: "9:00 AM",
      endTime: "10:30 AM",
      type: "Lecture",
      location: "Building B, Room 205",
      color: "purple"
    },
    {
      id: 4,
      course: "Economics 101",
      day: "Wednesday",
      startTime: "1:00 PM",
      endTime: "2:30 PM",
      type: "Seminar",
      location: "Building C, Room 310",
      color: "amber"
    },
    {
      id: 5,
      course: "Machine Learning",
      day: "Thursday",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      type: "Tutorial",
      location: "Building A, Room 105",
      color: "blue"
    }
  ];

  // Group schedule items by day
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weekly Schedule</h1>
        <p className="text-muted-foreground mt-1">Manage your classes and study sessions</p>
      </div>

      <div className="space-y-8">
        {days.map((day) => {
          const dayItems = scheduleItems.filter(item => item.day === day);
          
          return (
            <div key={day} className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-muted-foreground" />
                {day}
              </h2>
              
              {dayItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {dayItems.map((item) => (
                    <Card key={item.id} className="transition-all hover:shadow-md border-l-4" style={{ borderLeftColor: `var(--${item.color}-500)` }}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{item.course}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Clock className="w-4 h-4" />
                              <span>{item.startTime} - {item.endTime}</span>
                              <span className="px-2 py-0.5 bg-secondary rounded-full text-xs font-medium">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-sm mt-2 flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{item.location}</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No classes or study sessions scheduled for {day}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
