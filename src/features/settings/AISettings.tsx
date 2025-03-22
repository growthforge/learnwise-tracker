
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Save, XCircle } from "lucide-react";
import { aiService } from "@/services/aiService";

const AISettings = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    // Check if API key exists
    const exists = aiService.hasApiKey();
    setHasKey(exists);
    
    // If we're editing and have a key, populate the input field with asterisks
    if (exists && !isEditing) {
      setApiKey("••••••••••••••••••••••••••••");
    }
  }, [isEditing]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("API key cannot be empty");
      return;
    }

    try {
      // Don't save if it's just the masked version
      if (apiKey !== "••••••••••••••••••••••••••••") {
        aiService.setApiKey(apiKey);
        toast.success("API key saved successfully");
      }
      setHasKey(true);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save API key");
    }
  };

  const handleRemoveApiKey = () => {
    try {
      aiService.clearApiKey();
      setApiKey("");
      setHasKey(false);
      toast.success("API key removed");
    } catch (error) {
      toast.error("Failed to remove API key");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          <span>AI Integration Settings</span>
        </CardTitle>
        <CardDescription>
          Configure your OpenRouter API key to enable AI-powered features.
          {hasKey && !isEditing && " An API key is currently set."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="openrouter-api-key" className="text-sm font-medium">
              OpenRouter API Key
            </label>
            <div className="flex gap-2">
              <Input
                id="openrouter-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenRouter API key"
                disabled={hasKey && !isEditing}
                className="flex-1"
              />
              {hasKey && !isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and is not sent to our servers.
              <br />
              Don't have an API key? <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Get one from OpenRouter</a>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {(hasKey || apiKey) && (
          <Button variant="outline" onClick={handleRemoveApiKey} className="text-destructive hover:bg-destructive/10">
            <XCircle className="mr-2 h-4 w-4" />
            Remove API Key
          </Button>
        )}
        {(!hasKey || isEditing) && (
          <Button onClick={handleSaveApiKey} className="ml-auto">
            <Save className="mr-2 h-4 w-4" />
            Save API Key
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AISettings;
