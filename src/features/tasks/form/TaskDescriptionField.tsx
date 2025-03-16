
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskDescriptionField: React.FC<TaskDescriptionFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
      <Textarea 
        id="description" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Additional details about the task" 
        rows={3} 
      />
    </div>
  );
};

export default TaskDescriptionField;
