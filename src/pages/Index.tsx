
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <span className="font-bold text-xl">StudyFlow</span>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  The Intelligent Academic Planner
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Organize your courses, manage assignments, and optimize your study time with AI-powered insights.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {user ? (
                    <Link to="/dashboard">
                      <Button size="lg">Go to Dashboard</Button>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <Button size="lg">Get Started</Button>
                    </Link>
                  )}
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="StudyFlow Dashboard"
                  width={600}
                  height={400}
                  className="aspect-video rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Features
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
                Everything you need to excel in your academic journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Course Management</h3>
                <p className="text-muted-foreground">
                  Keep track of all your courses, deadlines, and class schedules in one place.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Task Tracking</h3>
                <p className="text-muted-foreground">
                  Manage assignments, readings, and projects with priority-based task lists.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Study Sessions</h3>
                <p className="text-muted-foreground">
                  Track focused study time and build consistent learning habits.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Calendar Integration</h3>
                <p className="text-muted-foreground">
                  View all your academic commitments in a comprehensive calendar.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="text-muted-foreground">
                  Gain insights into your study habits and academic performance.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Recommendations</h3>
                <p className="text-muted-foreground">
                  Receive personalized study plans and optimization suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
              Ready to Boost Your Academic Performance?
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto mb-6">
              Join thousands of students who are already optimizing their study time with StudyFlow.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg">Get Started for Free</Button>
              </Link>
            )}
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2023 StudyFlow. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:underline">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { BrainCircuit, GraduationCap, CheckSquare, Clock, Calendar, BarChart3 } from "lucide-react";

export default Index;
