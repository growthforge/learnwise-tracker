
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookText, Calendar, CheckSquare, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookText className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">StudyFlow</span>
        </div>
        <div>
          <Link to="/auth">
            <Button variant="outline" className="mr-2">Login</Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Master Your Academic Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            Organize your courses, track study time, and boost productivity with StudyFlow's powerful learning tools.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth?tab=signup">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm border rounded-2xl shadow-xl p-6 dark:bg-black/80">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-10 bg-primary/10 rounded flex items-center px-4 text-sm">
                    <BookText size={18} className="mr-2 text-primary" /> 
                    <span>Study Dashboard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-secondary/50 rounded p-3">
                      <div className="text-xs text-muted-foreground">Tasks</div>
                      <div className="mt-2 flex items-center">
                        <CheckSquare size={16} className="mr-2" />
                        <span className="text-sm">5 pending</span>
                      </div>
                    </div>
                    <div className="h-24 bg-secondary/50 rounded p-3">
                      <div className="text-xs text-muted-foreground">Schedule</div>
                      <div className="mt-2 flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm">2 today</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-32 bg-secondary/50 rounded p-3">
                    <div className="flex justify-between mb-2">
                      <div className="text-xs text-muted-foreground">Weekly Progress</div>
                      <BarChart3 size={14} />
                    </div>
                    <div className="flex items-end h-16 gap-1 pt-2">
                      {[30, 45, 75, 50, 60, 40, 65].map((h, i) => (
                        <div
                          key={i}
                          className="bg-primary/80 rounded-t w-full"
                          style={{ height: `${h}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose StudyFlow</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Plan your study sessions efficiently with our intelligent scheduling system that adapts to your learning patterns.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <CheckSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-muted-foreground">
              Never miss an assignment deadline with our comprehensive task management and priority system.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
            <p className="text-muted-foreground">
              Track your study patterns and academic progress with detailed analytics and insights.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your academic journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have boosted their productivity and achieved better results with StudyFlow.
          </p>
          <Link to="/auth?tab=signup">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-t pt-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookText className="h-5 w-5 text-primary" />
            <span className="font-semibold">StudyFlow</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2023 StudyFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
