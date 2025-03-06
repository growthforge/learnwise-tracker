
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import CourseCard, { Course } from "@/components/CourseCard";

// Sample data
const sampleCourses: Course[] = [
  {
    id: "course-1",
    name: "Machine Learning",
    code: "CS-433",
    professor: "Dr. Smith",
    color: "blue",
    progress: 65,
    upcomingDeadlines: 2,
    totalHoursSpent: 24,
    nextClass: {
      day: "Wednesday",
      time: "10:00 AM",
    },
  },
  {
    id: "course-2",
    name: "Data Structures",
    code: "CS-201",
    professor: "Dr. Johnson",
    color: "green",
    progress: 48,
    upcomingDeadlines: 1,
    totalHoursSpent: 18,
  },
  {
    id: "course-3",
    name: "Linear Algebra",
    code: "MATH-304",
    professor: "Dr. Williams",
    color: "purple",
    progress: 72,
    upcomingDeadlines: 3,
    totalHoursSpent: 20,
    nextClass: {
      day: "Thursday",
      time: "2:00 PM",
    },
  },
  {
    id: "course-4",
    name: "Economics 101",
    code: "ECON-101",
    professor: "Dr. Davis",
    color: "amber",
    progress: 30,
    upcomingDeadlines: 1,
    totalHoursSpent: 12,
  },
  {
    id: "course-5",
    name: "Introduction to Psychology",
    code: "PSYC-101",
    professor: "Dr. Taylor",
    color: "red",
    progress: 55,
    upcomingDeadlines: 0,
    totalHoursSpent: 15,
    nextClass: {
      day: "Monday",
      time: "1:00 PM",
    },
  },
  {
    id: "course-6",
    name: "Algorithms",
    code: "CS-301",
    professor: "Dr. Brown",
    color: "sky",
    progress: 42,
    upcomingDeadlines: 2,
    totalHoursSpent: 22,
  },
];

const Courses: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Courses</h1>
          <p className="text-muted-foreground">Manage your courses and track your progress</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <div className="w-48">
            <Select defaultValue="all">
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
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCourses.map((course) => (
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
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
