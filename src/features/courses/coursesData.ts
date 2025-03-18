
import { Course } from "@/components/CourseCard";

// Sample data for courses
export const sampleCourses: Course[] = [
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
