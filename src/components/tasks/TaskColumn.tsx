"use client";

import {
  TaskItem,
  TASK_STATUS_LABEL,
  TaskStatus,
  UpdateTaskInfoDto,
} from "@/features/task/types";
import { TaskCard } from "./TaskCard";
import { AddTaskInline } from "./AddTaskInline";

export function TaskColumn({
  status,
  tasks,
  onMoveForward,
  onAddTask,
  creatingTask,
  onUpdateTask,
  updatingTask,
}: {
  status: TaskStatus;
  tasks: TaskItem[];
  onMoveForward: (task: TaskItem) => void;
  onAddTask: (payload: UpdateTaskInfoDto) => Promise<void>;
  creatingTask: boolean;
  onUpdateTask: (id: string, payload: UpdateTaskInfoDto) => Promise<void>;
  updatingTask: boolean;
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
              onUpdate={onUpdateTask}
              isLoading={updatingTask}
            />
          ))
        )}
        {status === TaskStatus.TODO && (
          <AddTaskInline onSubmit={onAddTask} loading={!!creatingTask} />
        )}
      </div>
    </div>
  );
}
