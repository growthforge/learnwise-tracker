
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface TaskFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const TaskFormActions: React.FC<TaskFormActionsProps> = ({ onCancel, isEditing }) => {
  return (
    <DialogFooter className="mt-6">
      <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      <Button type="submit">{isEditing ? 'Update Task' : 'Add Task'}</Button>
    </DialogFooter>
  );
};

export default TaskFormActions;
