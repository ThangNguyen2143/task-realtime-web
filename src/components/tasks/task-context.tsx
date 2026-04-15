"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  TaskStatus,
  TaskItem,
  CreateTaskDto,
  UpdateTaskInfoDto,
} from "@/features/task/types";
import { fetchTasks } from "@/features/task/taskThunks";
import { useTaskRealtime } from "@/features/task/taskSocket";
import { useAppDispatch } from "@/store/hooks";

type TaskBoardContextValue = {
  tasks: TaskItem[];
  groupedTasks: Record<TaskStatus, TaskItem[]>;
  loading: boolean;
  error: string | null;
  joinedRoom: boolean;
  creatingTask: boolean;
  updatingTask: boolean;
  refreshTasks: () => Promise<void>;
  moveTask: (
    taskId: string,
    nextStatus: TaskStatus,
    nextOrder?: number,
  ) => Promise<void>;
  createTask: (payload: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskInfoDto) => Promise<void>;
};

const TaskBoardContext = createContext<TaskBoardContextValue | null>(null);

export function TaskBoardProvider({
  workspaceId,
  userId,
  children,
}: {
  workspaceId: string;
  userId: string;
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks(workspaceId));
  }, [workspaceId]);

  useTaskRealtime(workspaceId, userId);

  return children;
}

export function useTaskBoard() {
  const context = useContext(TaskBoardContext);
  if (!context) {
    throw new Error("useTaskBoard must be used inside TaskBoardProvider");
  }
  return context;
}
