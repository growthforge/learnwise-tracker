
import React from "react";
import { Course } from "@/components/CourseCard";
import { Task } from "@/components/TaskList";
import { StudyStats } from "@/components/StatsOverview";
import AIStudyRecommendations from "@/features/ai/AIStudyRecommendations";
import TaskList from "@/components/TaskList";
import CourseCard from "@/components/CourseCard";
import StudySession from "@/components/StudySession";
import TaskProgress from "./TaskProgress";

interface DashboardContentProps {
  courses: Course[];
  tasks: Task[];
  stats: StudyStats;
  onTaskToggle: (task: Task) => void;
  onSessionComplete: (sessionData: { courseId: string; duration: number; timestamp: Date }) => void;
  onGenerateDetailedPlan: (recommendation: any) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  courses,
  tasks,
  stats,
  onTaskToggle,
  onSessionComplete,
  onGenerateDetailedPlan,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="col-span-2 space-y-6">
        <AIStudyRecommendations
          courses={courses}
          tasks={tasks}
          studyHours={stats.weeklyData.map(d => d.hours)}
          onGenerateDetailedPlan={onGenerateDetailedPlan}
          className="hover-card glass-card"
        />

        <TaskList
          tasks={tasks.filter(t => !t.completed).slice(0, 3)}
          title="Priority Tasks"
          emptyMessage="No tasks due soon"
          showViewAll={true}
          onTaskToggle={onTaskToggle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.slice(0, 2).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <StudySession 
          courses={courses} 
          onSessionComplete={onSessionComplete}
        />
        
        <TaskProgress 
          completedTasks={stats.completedTasks} 
          totalTasks={stats.totalTasks} 
          streak={stats.streak} 
        />
      </div>
    </div>
  );
};

export default DashboardContent;
