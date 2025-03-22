
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Calendar } from "lucide-react";
import { toast } from "sonner";
import { 
  CourseHeader, 
  CourseSearchFilters, 
  CourseList, 
  CourseCalendarView,
  sampleCourses
} from "@/features/courses";
import { sampleTasks } from "@/features/tasks/taskUtils";
import { StudySession } from "@/features/calendar/types";

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("grid");
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  // Filter courses based on search term and semester filter
  const filteredCourses = sampleCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For demonstration purposes, we're not actually filtering by semester
    // In a real app, courses would have semester information
    return matchesSearch;
  });

  const handleAddCourse = () => {
    // In a real application, this would open a modal or navigate to a form
    console.log("Add course clicked");
  };

  const handleOpenFilters = () => {
    // In a real application, this would open a more advanced filters panel
    console.log("Open filters clicked");
  };

  const handleAddSession = (session: StudySession) => {
    setStudySessions([...studySessions, session]);
    toast.success("Study session added to calendar");
  };
  
  const handleUpdateSession = (updatedSession: StudySession) => {
    setStudySessions(
      studySessions.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );
    toast.success("Study session updated");
  };
  
  const handleDeleteSession = (sessionId: string) => {
    setStudySessions(
      studySessions.filter(session => session.id !== sessionId)
    );
    toast.success("Study session deleted");
  };

  return (
    <>
      <CourseHeader onAddCourse={handleAddCourse} />
      
      <CourseSearchFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        semesterFilter={semesterFilter}
        setSemesterFilter={setSemesterFilter}
        onOpenFilters={handleOpenFilters}
      />

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span>Grid View</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <CourseList 
            courses={filteredCourses} 
            onAddCourse={handleAddCourse} 
          />
        </TabsContent>
        
        <TabsContent value="calendar">
          <CourseCalendarView 
            courses={sampleCourses}
            tasks={sampleTasks}
            onAddSession={handleAddSession}
            onUpdateSession={handleUpdateSession}
            onDeleteSession={handleDeleteSession}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Courses;
