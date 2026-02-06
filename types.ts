
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface WorkUpdate {
  id: string;
  taskId: string;
  timestamp: number;
  percentage: number;
  timeSpent: number; // in minutes
  note: string;
}

export interface WorkTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  expectedDuration: number; // in minutes
  status: TaskStatus;
  currentProgress: number; // percentage
  totalTimeSpent: number; // total from all updates
  createdAt: number;
  updates: WorkUpdate[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
