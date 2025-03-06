
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckSquare, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Activity
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data
const weeklyData = [
  { day: "Mon", hours: 2.5, tasks: 3 },
  { day: "Tue", hours: 3.0, tasks: 2 },
  { day: "Wed", hours: 4.5, tasks: 4 },
  { day: "Thu", hours: 2.0, tasks: 1 },
  { day: "Fri", hours: 3.5, tasks: 3 },
  { day: "Sat", hours: 1.5, tasks: 2 },
  { day: "Sun", hours: 1.0, tasks: 1 },
];

const monthlyData = [
  { week: "Week 1", hours: 15, tasks: 12 },
  { week: "Week 2", hours: 20, tasks: 15 },
  { week: "Week 3", hours: 17, tasks: 13 },
  { week: "Week 4", hours: 22, tasks: 18 },
];

const courseDistribution = [
  { name: "Machine Learning", hours: 24, color: "#3b82f6" },
  { name: "Data Structures", hours: 18, color: "#22c55e" },
  { name: "Linear Algebra", hours: 20, color: "#a855f7" },
  { name: "Economics 101", hours: 12, color: "#f59e0b" },
  { name: "Psychology", hours: 15, color: "#ef4444" },
  { name: "Algorithms", hours: 22, color: "#0ea5e9" },
];

const timeDistribution = [
  { name: "Morning", value: 35 },
  { name: "Afternoon", value: 40 },
  { name: "Evening", value: 25 },
];

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b"];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  
  const data = timeRange === "weekly" ? weeklyData : monthlyData;
  const xKey = timeRange === "weekly" ? "day" : "week";
  
  const totalStudyHours = data.reduce((acc, item) => acc + item.hours, 0);
  const totalTasks = data.reduce((acc, item) => acc + item.tasks, 0);
  const averageHoursPerDay = totalStudyHours / data.length;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Analytics</h1>
          <p className="text-muted-foreground">Track your study progress and productivity</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total study time</p>
                <p className="text-2xl font-bold">{totalStudyHours} hours</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {averageHoursPerDay.toFixed(1)} hours per day
                </p>
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
                <p className="text-sm font-medium text-muted-foreground mb-1">Tasks completed</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(totalTasks / data.length).toFixed(1)} tasks per day
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/30">
                <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Productivity score</p>
                <p className="text-2xl font-bold">8.7/10</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <TrendingUp className="inline w-3.5 h-3.5 mr-1 text-green-600" />
                  <span>12% increase</span>
                </p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-full dark:bg-indigo-900/30">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Study Time Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis
                    dataKey={xKey}
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
                      border: 'none',
                    }}
                    labelStyle={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}
                  />
                  <Legend />
                  <Bar
                    dataKey="hours"
                    name="Study Hours"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="tasks"
                    name="Tasks Completed"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </ReBarChart>
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="hours"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none',
                    }}
                    formatter={(value, name, props) => [`${value} hours`, props.payload.name]}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Productivity Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis
                    dataKey={xKey}
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
                      border: 'none',
                    }}
                    labelStyle={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    name="Study Hours"
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
              <PieChart className="w-5 h-5 text-primary" />
              <span>Study Time of Day</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={timeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none',
                    }}
                    formatter={(value) => [`${value}%`, "Percentage"]}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-4">
              You're most productive in the afternoon
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
