"use client";

import { TaskItem, TASK_STATUS_LABEL } from "@/features/task/types";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const TaskCard = React.memo(function TaskCard({
  task,
  onMove,
}: {
  task: TaskItem;
  onMove: (taskId: string) => void;
}) {
  return (
    <div className="rounded-xl border bg-base-100 p-3 shadow-sm">
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="font-semibold">{task.title}</p>
          <span>
            <button
              className="btn btn-circle btn-sm tooltip"
              data-tip="Chỉnh sửa"
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
          </span>
        </div>

        {task.description ? (
          <p className="text-sm opacity-70 line-clamp-2">{task.description}</p>
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
    </div>
  );
});
