export type TaskItem = TaskOnList & {
  workspaceId?: string;
  description?: string;
  createAt?: Date;
  updateAt?: Date;
};
export type TaskOnList = {
  id: string;
  title: string;
  version: number;
  order: number;
  status: TaskStatus;
};
export type TaskDeleteResponse = {
  id: string;
  workspaceId: string;
  title: string;
};
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "Cần làm",
  [TaskStatus.IN_PROGRESS]: "Đang thực hiện",
  [TaskStatus.DONE]: "Hoàn thành",
};
export const TASK_STATUS_COLUMNS: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];
export type TaskRealtimeWithTaskPayload = {
  workspaceId: string;
  task: TaskItem;
};
export type TaskUpdateStatusSocketPayload = {
  workspaceId: string;
  tasks: TaskOnList[];
};

export type TaskDeletedSocketPayload = {
  workspaceId: string;
  taskId: string;
};

export type TaskSocketEventMap = {
  created: TaskRealtimeWithTaskPayload;
  updated: TaskRealtimeWithTaskPayload;
  statusUpdate: TaskUpdateStatusSocketPayload;
  delete: TaskDeletedSocketPayload;
};
export type CreateTaskDto = {
  title: string;
  description?: string;
  workspaceId: string;
};
export type UpdateTaskInfoDto = {
  title?: string;
  description?: string;
};
export type UpdateTaskStatusDto = {
  task_id: string;
  status: TaskStatus;
  order: number;
};
