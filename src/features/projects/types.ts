export interface Project {
  id: string;
  title: string;
  description?: string | null;
  taskCount: number;
  completedCount: number;
  progress: number;
  created_at: string;
  updated_at: string;
}
