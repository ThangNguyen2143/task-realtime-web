"use client";

import {
  TaskItem,
  TASK_STATUS_LABEL,
  UpdateTaskInfoDto,
} from "@/features/task/types";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export const TaskCard = React.memo(function TaskCard({
  task,
  onMove,
  onUpdate,
  isLoading,
}: {
  task: TaskItem;
  onMove: (taskId: string) => void;
  onUpdate: (taskId: string, payload: UpdateTaskInfoDto) => Promise<void>;
  isLoading: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [taskForm, setTaskForm] = useState<UpdateTaskInfoDto>({
    title: task.title,
    description: task.description ?? "",
  });
  useEffect(() => {
    if (!isEditing) {
      setTaskForm({
        title: task.title,
        description: task.description ?? "",
      });
    }
  }, [task.title, task.description, isEditing]);
  const handleStartEdit = () => {
    setTaskForm({
      title: task.title,
      description: task.description ?? "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTaskForm({
      title: task.title,
      description: task.description ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload: UpdateTaskInfoDto = {
      title: taskForm.title?.trim() || "",
      description: taskForm.description?.trim() || "",
    };

    if (!payload.title) return;

    try {
      setIsSaving(true);
      await onUpdate(task.id, payload);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="rounded-xl border bg-base-100 p-3 shadow-sm">
      {isLoading ? (
        <div>
          <span className="loading loading-dots"></span>
        </div>
      ) : isEditing ? (
        <div className="space-y-3">
          <input
            className="input input-bordered w-full"
            value={taskForm.title ?? ""}
            onChange={(e) =>
              setTaskForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="Tiêu đề task"
            disabled={isSaving}
          />

          <textarea
            className="textarea textarea-bordered w-full"
            value={taskForm.description ?? ""}
            onChange={(e) =>
              setTaskForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Mô tả task"
            disabled={isSaving}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs opacity-60">
              {TASK_STATUS_LABEL[task.status]}
            </span>

            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-ghost"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <button
                className="btn btn-sm btn-primary"
                onClick={handleSave}
                disabled={isSaving || !taskForm.title?.trim()}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="font-semibold">{task.title}</p>
            <span>
              <button
                className="btn btn-circle btn-sm tooltip"
                data-tip="Chỉnh sửa"
                onClick={handleStartEdit}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            </span>
          </div>

          {task.description ? (
            <p className="text-sm opacity-70 line-clamp-2">
              {task.description}
            </p>
          ) : null}

          <div className="flex items-center justify-between">
            <span className="text-xs opacity-60">
              {TASK_STATUS_LABEL[task.status]}
            </span>

            <button className="btn btn-xs" onClick={() => onMove(task.id)}>
              Chuyển bước
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
