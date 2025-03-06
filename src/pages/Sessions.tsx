import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Calendar, 
  Plus, 
  BookOpen, 
  Search, 
  Filter, 
  BarChart3,
  History
} from "lucide-react";
import { Input } from "@/components/ui/input";
import StudySession, { Course } from "@/components/StudySession";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data
const sampleCourses: Course[] = [
  { id: "course-1", name: "Machine Learning", code: "CS-433", color: "blue" },
  { id: "course-2", name: "Data Structures", code: "CS-201", color: "green" },
  { id: "course-3", name: "Linear Algebra", code: "MATH-304", color: "purple" },
  { id: "course-4", name: "Economics 101", code: "ECON-101", color: "amber" },
  { id: "course-5", name: "Introduction to Psychology", code: "PSYC-101", color: "red" },
  { id: "course-6", name: "Algorithms", code: "CS-301", color: "sky" },
];

const sampleSessionHistory = [
  { id: "1", course: "Machine Learning", date: "Today", duration: "01:30:00", completed: true },
  { id: "2", course: "Data Structures", date: "Yesterday", duration: "00:45:00", completed: true },
  { id: "3", course: "Linear Algebra", date: "Yesterday", duration: "02:00:00", completed: true },
  { id: "4", course: "Machine Learning", date: "Mon, Jun 12", duration: "01:15:00", completed: true },
  { id: "5", course: "Economics 101", date: "Mon, Jun 12", duration: "00:30:00", completed: false },
  { id: "6", course: "Data Structures", date: "Sun, Jun 11", duration: "01:45:00", completed: true },
  { id: "7", course: "Psychology", date: "Sat, Jun 10", duration: "01:00:00", completed: true },
];

const weeklySessionData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.0 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 2.0 },
  { day: "Fri", hours: 3.5 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 1.0 },
];

const Sessions: React.FC = () => {
  const handleSessionComplete = (sessionData: {
    courseId: string;
    duration: number;
    timestamp: Date;
  }) => {
    const course = sampleCourses.find(c => c.id === sessionData.courseId);
    
    toast.success("Study session completed!", {
      description: `You studied ${course?.name} for ${Math.floor(sessionData.duration / 60)} minutes.`,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Sessions</h1>
          <p className="text-muted-foreground">Track your focused study time</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <StudySession 
          courses={sampleCourses} 
          onSessionComplete={handleSessionComplete}
          className="lg:col-span-1"
        />

        <Card className="lg:col-span-2 hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Weekly Study Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklySessionData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={36}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                    unit="h"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                    labelStyle={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}
                  />
                  <Bar
                    dataKey="hours"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Study Hours"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div>Total: <span className="font-medium">{weeklySessionData.reduce((acc, item) => acc + item.hours, 0)} hours</span> this week</div>
              <div>Daily Average: <span className="font-medium">{(weeklySessionData.reduce((acc, item) => acc + item.hours, 0) / 7).toFixed(1)} hours</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">Session History</h2>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search sessions..." 
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <div className="w-48">
              <Select defaultValue="all">
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

        <div className="bg-card rounded-lg border subtle-border overflow-hidden">
          <div className="p-4 grid grid-cols-12 bg-muted/50 text-sm font-medium">
            <div className="col-span-5 sm:col-span-4">Course</div>
            <div className="col-span-3 sm:col-span-3">Date</div>
            <div className="col-span-3 sm:col-span-3">Duration</div>
            <div className="hidden sm:block sm:col-span-2">Status</div>
          </div>
          <div className="divide-y subtle-border">
            {sampleSessionHistory.map((session) => (
              <div key={session.id} className="p-4 grid grid-cols-12 items-center text-sm hover:bg-muted/20 transition-colors">
                <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{session.course}</span>
                </div>
                <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{session.date}</span>
                </div>
                <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{session.duration}</span>
                </div>
                <div className="hidden sm:flex sm:col-span-2 items-center">
                  {session.completed ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs dark:bg-green-900/30 dark:text-green-300">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs dark:bg-amber-900/30 dark:text-amber-300">
                      Interrupted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sessions;
