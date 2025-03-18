
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Calendar } from "lucide-react";
import { 
  CourseHeader, 
  CourseSearchFilters, 
  CourseList, 
  CourseCalendarView,
  sampleCourses
} from "@/features/courses";

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("grid");

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
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Courses;
