export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  user_id: number;
}

export interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
}