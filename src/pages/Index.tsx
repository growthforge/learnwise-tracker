
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { Check, BarChart, Calendar, Clock, GraduationCap, Book } from 'lucide-react';
import MarketingLayout from '@/components/MarketingLayout';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const features = [
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: 'Course Management',
      description: 'Organize all your academic courses in one place with detailed tracking.'
    },
    {
      icon: <Check className="h-10 w-10 text-primary" />,
      title: 'Task Tracking',
      description: 'Never miss a deadline with our comprehensive task management system.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: 'Smart Scheduling',
      description: 'Optimize your study time with our intelligent scheduling recommendations.'
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Study Sessions',
      description: 'Track your focused study time and measure your productivity.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'Detailed Analytics',
      description: 'Gain insights into your study habits with comprehensive analytics.'
    },
    {
      icon: <Book className="h-10 w-10 text-primary" />,
      title: 'AI Recommendations',
      description: 'Get personalized study plans and recommendations based on your progress.'
    }
  ];
  
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Master Your Studies with <span className="text-primary">StudyFlow</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                The all-in-one platform to organize your courses, track assignments, and optimize your study time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/auth?mode=signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground/20 rounded-lg blur-lg opacity-30"></div>
                <div className="relative bg-card rounded-lg shadow-lg overflow-hidden border">
                  <img 
                    src="/placeholder.svg" 
                    alt="StudyFlow Dashboard" 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium">Intuitive Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-1">Track your progress and manage your academic life</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Features that empower your studies</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to organize, track, and optimize your academic journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-sm border transition-all hover:shadow-md">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to optimize your academic success?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who are already using StudyFlow to achieve their academic goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/auth?mode=signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth?mode=login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Index;
