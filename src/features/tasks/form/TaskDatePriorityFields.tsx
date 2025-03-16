
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskDatePriorityFieldsProps {
  dueDate: string;
  onDueDateChange: (value: string) => void;
  priority: "high" | "medium" | "low";
  onPriorityChange: (value: "high" | "medium" | "low") => void;
}

const TaskDatePriorityFields: React.FC<TaskDatePriorityFieldsProps> = ({ 
  dueDate, 
  onDueDateChange, 
  priority, 
  onPriorityChange 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
        <Input 
          id="dueDate" 
          type="text" 
          value={dueDate} 
          onChange={(e) => onDueDateChange(e.target.value)} 
          placeholder="Tomorrow at 11:59 PM" 
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="priority" className="text-sm font-medium">Priority</label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskDatePriorityFields;
