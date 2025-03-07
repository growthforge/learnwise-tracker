
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "./StudySession";
import { toast } from 'sonner';

export interface StudySessionData {
  id: string;
  courseId: string;
  date: string;
  duration: string;
  completed: boolean;
  notes?: string;
}

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: StudySessionData) => void;
  initialSession?: StudySessionData;
  courses: Course[];
}

const SessionForm: React.FC<SessionFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialSession,
  courses
}) => {
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [completed, setCompleted] = useState(true);
  const [notes, setNotes] = useState('');

  // Populate form when editing an existing session
  useEffect(() => {
    if (initialSession) {
      setCourseId(initialSession.courseId);
      setDate(initialSession.date);
      setDuration(initialSession.duration);
      setCompleted(initialSession.completed);
      setNotes(initialSession.notes || '');
    } else {
      // Reset form when adding a new session
      setCourseId('');
      setDate('Today');
      setDuration('01:30:00');
      setCompleted(true);
      setNotes('');
    }
  }, [initialSession, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId) {
      toast.error("Please select a course");
      return;
    }
    
    if (!date) {
      toast.error("Date is required");
      return;
    }
    
    if (!duration) {
      toast.error("Duration is required");
      return;
    }
    
    const sessionData: StudySessionData = {
      id: initialSession?.id || `session-${Date.now()}`,
      courseId,
      date,
      duration,
      completed,
      notes: notes || undefined
    };
    
    onSave(sessionData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialSession ? 'Edit Study Session' : 'Add New Study Session'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="course" className="text-sm font-medium">Course</label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full bg-${course.color}-500`}></div>
                      <span>{course.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Date</label>
              <Input 
                id="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                placeholder="Today" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">Duration (HH:MM:SS)</label>
              <Input 
                id="duration" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                placeholder="01:30:00" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <Select 
              value={completed ? "completed" : "interrupted"} 
              onValueChange={(value) => setCompleted(value === "completed")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="interrupted">Interrupted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes (optional)</label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="What did you learn or accomplish in this session?" 
              rows={3} 
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialSession ? 'Update Session' : 'Add Session'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionForm;
