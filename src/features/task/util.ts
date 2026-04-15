import { TaskItem, TaskOnList, TaskStatus } from "./types";

export type GroupedTasks = Record<TaskStatus, TaskItem[]>;

export function groupTasksByStatus(tasks: TaskItem[]): GroupedTasks {
  return {
    [TaskStatus.TODO]: tasks
      .filter((task) => task.status === TaskStatus.TODO)
      .sort((a, b) => a.order - b.order),

    [TaskStatus.IN_PROGRESS]: tasks
      .filter((task) => task.status === TaskStatus.IN_PROGRESS)
      .sort((a, b) => a.order - b.order),

    [TaskStatus.DONE]: tasks
      .filter((task) => task.status === TaskStatus.DONE)
      .sort((a, b) => a.order - b.order),
  };
}

export function upsertTask<T extends { id: string }>(
  tasks: T[],
  incoming: T,
): T[] {
  const index = tasks.findIndex((task) => task.id === incoming.id);

  if (index === -1) {
    return [...tasks, incoming];
  }

  const next = [...tasks];
  next[index] = {
    ...next[index],
    ...incoming,
  };

  return next;
}
export function mergeTasksById<T extends { id: string }>(
  currentTasks: T[],
  incomingTasks: T[],
): T[] {
  if (incomingTasks.length === 0) return currentTasks;
  if (currentTasks.length === 0) return incomingTasks;

  const incomingMap = new Map(incomingTasks.map((task) => [task.id, task]));
  const mergedIds = new Set<string>();

  const nextTasks = currentTasks.map((task) => {
    const incoming = incomingMap.get(task.id);

    if (!incoming) return task;

    mergedIds.add(task.id);
    return {
      ...task,
      ...incoming,
    };
  });

  for (const task of incomingTasks) {
    if (!mergedIds.has(task.id)) {
      nextTasks.push(task);
    }
  }

  return nextTasks;
}
export function removeTaskById<T extends { id: string }>(
  tasks: T[],
  taskId: string,
): T[] {
  return tasks.filter((task) => task.id !== taskId);
}
export const convertToTaskItem = (
  tasks: TaskOnList[],
  extra?: Partial<TaskItem>,
): TaskItem[] => {
  return tasks.map((t) => ({
    ...t,
    ...extra, // optional: workspaceId, timestamps nếu cần
  }));
};
