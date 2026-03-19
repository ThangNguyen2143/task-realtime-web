"use client";

import { TaskItem, TASK_STATUS_LABEL, TaskStatus } from "@/features/task/types";
import { TaskCard } from "./TaskCard";
import { AddTaskInline } from "./AddTaskInline";

export function TaskColumn({
  status,
  tasks,
  onMoveForward,
  onAddTask,
  creatingTask,
}: {
  status: TaskStatus;
  tasks: TaskItem[];
  onMoveForward: (task: TaskItem) => void;
  onAddTask?: (title: string) => Promise<void>;
  creatingTask?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-base-200/40 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">{TASK_STATUS_LABEL[status]}</h3>
        <span className="badge badge-neutral">{tasks.length}</span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed p-4 text-sm opacity-60">
            Không có task
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={() => onMoveForward(task)}
            />
          ))
        )}
        {status === TaskStatus.TODO && onAddTask ? (
          <AddTaskInline onSubmit={onAddTask} loading={!!creatingTask} />
        ) : null}
      </div>
    </div>
  );
}
