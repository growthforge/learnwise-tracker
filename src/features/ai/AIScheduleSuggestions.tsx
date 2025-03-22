
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Clock, ArrowRight, Loader2, Calendar } from "lucide-react";
import { AIScheduleSuggestion, aiService } from "@/services/aiService";
import { toast } from "sonner";
import { format } from "date-fns";

interface AIScheduleSuggestionsProps {
  courses: any[];
  existingSchedule?: any[];
  onApplySuggestion?: (suggestion: AIScheduleSuggestion) => void;
  className?: string;
}

const AIScheduleSuggestions: React.FC<AIScheduleSuggestionsProps> = ({
  courses,
  existingSchedule = [],
  onApplySuggestion,
  className
}) => {
  const [suggestions, setSuggestions] = useState<AIScheduleSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(aiService.hasApiKey());

  const fetchSuggestions = async () => {
    if (!hasApiKey) {
      toast.error("Please set your OpenRouter API key in Settings to use AI features");
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiService.getScheduleSuggestions(courses, existingSchedule);
      setSuggestions(result);
    } catch (error) {
      console.error("Error fetching schedule suggestions:", error);
      toast.error("Failed to get schedule suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: AIScheduleSuggestion) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    } else {
      toast.success(`Suggestion for ${suggestion.courseName} added to your schedule`);
    }
  };

  // Convert time string (HH:MM) to a more readable format
  const formatTimeString = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return format(date, 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>AI Schedule Suggestions</span>
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
        ) : suggestions.length === 0 && !isLoading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Get AI-powered suggestions for optimal study times based on your courses and schedule.
            </p>
            <Button onClick={fetchSuggestions}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Schedule Suggestions
            </Button>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              Analyzing your schedule and optimizing study times...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-secondary p-3 rounded-lg">
                <div className="flex gap-2 items-center text-sm font-medium mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{suggestion.courseName} | {suggestion.dayOfWeek} at {formatTimeString(suggestion.startTime)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {suggestion.duration} minutes • {suggestion.reason}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleApplySuggestion(suggestion)}
                >
                  Add to Schedule <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </div>
            ))}
            
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={fetchSuggestions}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Refresh Suggestions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIScheduleSuggestions;
