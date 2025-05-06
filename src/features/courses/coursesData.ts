
import { Course } from "@/components/CourseCard";

// Define a type for the nextClass property since it's not a standard Date
interface CourseNextClass {
  day: string;
  time: string;
}

// Define the extended Course type that includes the custom nextClass format
interface SampleCourse extends Omit<Course, 'nextClass'> {
  nextClass?: CourseNextClass;
}

export const sampleCourses: SampleCourse[] = [
  {
    id: "course-1",
    name: "Machine Learning",
    code: "CS-433",
    color: "blue",
    professor: "Dr. Sarah Johnson",
    progress: 45,
    nextClass: {
      day: "Monday",
      time: "10:30"
    },
    upcomingDeadlines: 2,
    totalHours: 24,
    totalHoursSpent: 24
  },
  {
    id: "course-2",
    name: "Data Structures",
    code: "CS-201",
    color: "green",
    professor: "Prof. Michael Chen",
    progress: 60,
    nextClass: {
      day: "Wednesday",
      time: "14:00"
    },
    upcomingDeadlines: 1,
    totalHours: 18,
    totalHoursSpent: 18
  },
  {
    id: "course-3",
    name: "Linear Algebra",
    code: "MATH-304",
    color: "purple",
    professor: "Dr. Emma Rodriguez",
    progress: 75,
    nextClass: {
      day: "Thursday",
      time: "09:00"
    },
    upcomingDeadlines: 0,
    totalHours: 15,
    totalHoursSpent: 15
  },
  {
    id: "course-4",
    name: "Economics 101",
    code: "ECON-101",
    color: "amber",
    professor: "Prof. Alan Smith",
    progress: 30,
    upcomingDeadlines: 1,
    totalHours: 12,
    totalHoursSpent: 12
  },
  {
    id: "course-5",
    name: "Introduction to Psychology",
    code: "PSYC-101",
    color: "red",
    professor: "Dr. Rachel Green",
    progress: 50,
    upcomingDeadlines: 1,
    totalHours: 10,
    totalHoursSpent: 10
  },
  {
    id: "course-6",
    name: "Algorithms",
    code: "CS-301",
    color: "sky",
    professor: "Prof. David Lee",
    progress: 65,
    upcomingDeadlines: 1,
    totalHours: 22,
    totalHoursSpent: 22
  }
];
