
import { Task } from "@/components/TaskList";

// Sample data
export const sampleCourses = [
  { id: "course-1", name: "Machine Learning", code: "CS-433", color: "blue" },
  { id: "course-2", name: "Data Structures", code: "CS-201", color: "green" },
  { id: "course-3", name: "Linear Algebra", code: "MATH-304", color: "purple" },
  { id: "course-4", name: "Economics 101", code: "ECON-101", color: "amber" },
  { id: "course-5", name: "Introduction to Psychology", code: "PSYC-101", color: "red" },
  { id: "course-6", name: "Algorithms", code: "CS-301", color: "sky" },
];

export const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete ML Assignment 3",
    course: {
      id: "course-1",
      name: "Machine Learning",
      code: "CS-433",
      color: "blue",
    },
    due: "Tomorrow at 11:59 PM",
    completed: false,
    priority: "high",
    estimatedTime: 3,
  },
  {
    id: "task-2",
    title: "Read Chapter 5",
    course: {
      id: "course-4",
      name: "Economics 101",
      code: "ECON-101",
      color: "amber",
    },
    due: "Friday at 6:00 PM",
    completed: false,
    priority: "medium",
    estimatedTime: 2,
  },
  {
    id: "task-3",
    title: "Prepare for Linear Algebra Quiz",
    course: {
      id: "course-3",
      name: "Linear Algebra",
      code: "MATH-304",
      color: "purple",
    },
    due: "Next Monday",
    completed: false,
    priority: "high",
    estimatedTime: 4,
  },
  {
    id: "task-4",
    title: "Review lecture notes",
    course: {
      id: "course-2",
      name: "Data Structures",
      code: "CS-201",
      color: "green",
    },
    due: "Tomorrow at 9:00 AM",
    completed: false,
    priority: "medium",
    estimatedTime: 1.5,
  },
  {
    id: "task-5",
    title: "Submit Psychology Essay",
    course: {
      id: "course-5",
      name: "Introduction to Psychology",
      code: "PSYC-101",
      color: "red",
    },
    due: "Next Wednesday",
    completed: false,
    priority: "low",
    estimatedTime: 5,
  },
  {
    id: "task-6",
    title: "Algorithms Problem Set 2",
    course: {
      id: "course-6",
      name: "Algorithms",
      code: "CS-301",
      color: "sky",
    },
    due: "Friday",
    completed: true,
    priority: "high",
    estimatedTime: 4,
  },
  {
    id: "task-7",
    title: "Economics Quiz 1",
    course: {
      id: "course-4",
      name: "Economics 101",
      code: "ECON-101",
      color: "amber",
    },
    due: "Last Monday",
    completed: true,
    priority: "medium",
    estimatedTime: 2,
  },
];
