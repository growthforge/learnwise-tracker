
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, BookOpen, CheckSquare, BarChart } from "lucide-react";
import { LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

export interface StudyStats {
  totalHours: number;
  weeklyHours: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
  weeklyData: Array<{
    day: string;
    hours: number;
  }>;
  courseDistribution: Array<{
    name: string;
    hours: number;
    color: string;
  }>;
}

interface StatsOverviewProps {
  stats: StudyStats;
  className?: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      <Card className="col-span-2 hover-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="w-5 h-5 text-primary" />
            <span>Study Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.weeklyData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickLine={false}
                  axisLine={false}
                  unit="h"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 8, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    border: 'none' 
                  }}
                  labelStyle={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Course Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart
                data={stats.courseDistribution}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                barSize={24}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickLine={false}
                  axisLine={false}
                  unit="h"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 8, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    border: 'none' 
                  }}
                  labelStyle={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}
                />
                <Bar 
                  dataKey="hours" 
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--accent))"
                />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total study time</p>
                <p className="text-2xl font-bold">{stats.totalHours} hours</p>
                <p className="text-sm text-muted-foreground mt-1">{stats.weeklyHours} hours this week</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Task completion</p>
                <p className="text-2xl font-bold">{stats.completedTasks}/{stats.totalTasks}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completion rate
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/30">
                <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 hover-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Study streak</p>
                <p className="text-2xl font-bold">{stats.streak} days</p>
                <p className="text-sm text-muted-foreground mt-1">Keep it up!</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full dark:bg-amber-900/30">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsOverview;
