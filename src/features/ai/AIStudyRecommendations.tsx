
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, BrainCircuit, ArrowRight, Loader2 } from "lucide-react";
import { AIStudyRecommendation, aiService } from "@/services/aiService";
import { toast } from "sonner";

interface AIStudyRecommendationsProps {
  courses: any[];
  tasks: any[];
  studyHours?: number[];
  onGenerateDetailedPlan?: (recommendation: AIStudyRecommendation) => void;
  className?: string;
}

const AIStudyRecommendations: React.FC<AIStudyRecommendationsProps> = ({
  courses,
  tasks,
  studyHours = [],
  onGenerateDetailedPlan,
  className
}) => {
  const [recommendations, setRecommendations] = useState<AIStudyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(aiService.hasApiKey());
  }, []);

  const fetchRecommendations = async () => {
    if (!hasApiKey) {
      toast.error("Please set your OpenRouter API key in Settings to use AI features");
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiService.getStudyRecommendations(courses, tasks, studyHours);
      setRecommendations(result);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to get study recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDetailedPlan = (recommendation: AIStudyRecommendation) => {
    if (onGenerateDetailedPlan) {
      onGenerateDetailedPlan(recommendation);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          <span>AI Study Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasApiKey ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              AI features require an OpenRouter API key. Please add your API key in Settings.
            </p>
            <Button variant="secondary" asChild>
              <a href="/settings">Go to Settings</a>
            </Button>
          </div>
        ) : recommendations.length === 0 && !isLoading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Get personalized study recommendations based on your courses and upcoming tasks.
            </p>
            <Button onClick={fetchRecommendations}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Recommendations
            </Button>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              Analyzing your courses and tasks...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-secondary p-3 rounded-lg">
                <div className="flex gap-2 items-center text-sm font-medium mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Focus on {rec.courseName} for {rec.recommendedHours} hours</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {rec.reason}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleGenerateDetailedPlan(rec)}
                >
                  Generate Detailed Plan <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </div>
            ))}
            
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={fetchRecommendations}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Refresh Recommendations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIStudyRecommendations;
