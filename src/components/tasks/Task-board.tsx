"use client";

import {
  TaskItem,
  TASK_STATUS_COLUMNS,
  TaskStatus,
} from "@/features/task/types";
import { useTaskBoard } from "./task-context";
import { TaskColumn } from "./TaskColumn";

function getNextStatus(status: TaskStatus): TaskStatus {
  switch (status) {
    case TaskStatus.TODO:
      return TaskStatus.IN_PROGRESS;
    case TaskStatus.IN_PROGRESS:
      return TaskStatus.DONE;
    case TaskStatus.DONE:
    default:
      return TaskStatus.DONE;
  }
}

export function TaskBoard({ workspaceId }: { workspaceId: string }) {
  const { groupedTasks, loading, error, moveTask, createTask, creatingTask } =
    useTaskBoard();

  const handleMoveForward = async (task: TaskItem) => {
    const nextStatus = getNextStatus(task.status);

    if (nextStatus === task.status) return;

    const nextOrder = groupedTasks[nextStatus].length;

    await moveTask(task.id, nextStatus, nextOrder);
  };
  const handleAddTask = async (title: string) => {
    if (!workspaceId) return;

    await createTask({
      title,
      workspaceId,
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-2xl border p-4">
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-base-300" />
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-xl bg-base-300" />
              <div className="h-24 animate-pulse rounded-xl bg-base-300" />
              <div className="h-24 animate-pulse rounded-xl bg-base-300" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {TASK_STATUS_COLUMNS.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={groupedTasks[status]}
          onMoveForward={handleMoveForward}
          onAddTask={status === TaskStatus.TODO ? handleAddTask : undefined}
          creatingTask={creatingTask}
        />
      ))}
    </div>
  );
}
