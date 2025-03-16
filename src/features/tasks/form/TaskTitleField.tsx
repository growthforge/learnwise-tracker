
import React from 'react';
import { Input } from "@/components/ui/input";

interface TaskTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskTitleField: React.FC<TaskTitleFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="title" className="text-sm font-medium">Title</label>
      <Input 
        id="title" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Task title" 
      />
    </div>
  );
};

export default TaskTitleField;
