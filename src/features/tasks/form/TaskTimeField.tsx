
import React from 'react';
import { Input } from "@/components/ui/input";

interface TaskTimeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskTimeField: React.FC<TaskTimeFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="estimatedTime" className="text-sm font-medium">Estimated Hours</label>
      <Input 
        id="estimatedTime" 
        type="number" 
        min="0.5" 
        step="0.5" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Estimated hours to complete" 
      />
    </div>
  );
};

export default TaskTimeField;
