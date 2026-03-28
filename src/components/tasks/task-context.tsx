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
  CreateNewTaskApi,
  getTaskListApi,
  UpdateInfoTaskApi,
  UpdateStatusTaskApi,
} from "@/features/task/api";
import {
  TaskRealtimeWithTaskPayload,
  TaskDeletedSocketPayload,
  TaskStatus,
  UpdateTaskStatusDto,
  TaskUpdateStatusSocketPayload,
  TaskItem,
  CreateTaskDto,
  UpdateTaskInfoDto,
} from "@/features/task/types";
import { useTaskSocket } from "@/features/task/use-task-socket";
import {
  groupTasksByStatus,
  mergeTasksById,
  removeTaskById,
  upsertTask,
} from "@/features/task/util";

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
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(false);
  const tasksRef = useRef<TaskItem[]>([]);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getTaskListApi(workspaceId);
      setTasks(response.value ?? []);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách task");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const moveTask = useCallback(
    async (taskId: string, nextStatus: TaskStatus, nextOrder = 0) => {
      const prevTasks = tasksRef.current;

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? { ...task, status: nextStatus, order: nextOrder }
            : task,
        ),
      );

      try {
        const payload: UpdateTaskStatusDto = {
          task_id: taskId,
          status: nextStatus,
          order: nextOrder,
        };

        await UpdateStatusTaskApi(payload);
      } catch (err) {
        console.error(err);
        setTasks(prevTasks);
      }
    },
    [],
  );
  const createTask = useCallback(async (payload: CreateTaskDto) => {
    try {
      setCreatingTask(true);
      await CreateNewTaskApi(payload);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setCreatingTask(false);
    }
  }, []);
  const updateInfoTask = useCallback(
    async (id: string, payload: UpdateTaskInfoDto) => {
      try {
        setUpdatingTask(true);
        await UpdateInfoTaskApi(id, payload);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setUpdatingTask(false);
      }
    },
    [],
  );
  const handleCreated = useCallback((payload: TaskRealtimeWithTaskPayload) => {
    setTasks((current) => upsertTask(current, payload.task));
  }, []);

  const handleUpdated = useCallback((payload: TaskRealtimeWithTaskPayload) => {
    setTasks((current) => upsertTask(current, payload.task));
  }, []);

  const handleStatusUpdated = useCallback(
    (payload: TaskUpdateStatusSocketPayload) => {
      setTasks((current) => mergeTasksById(current, payload.tasks));
    },
    [],
  );

  const handleDeleted = useCallback((payload: TaskDeletedSocketPayload) => {
    setTasks((current) => removeTaskById(current, payload.taskId));
  }, []);

  useTaskSocket({
    workspaceId,
    userId,
    onJoined: () => setJoinedRoom(true),
    onCreated: handleCreated,
    onUpdated: handleUpdated,
    onStatusUpdated: handleStatusUpdated,
    onDeleted: handleDeleted,
  });

  const groupedTasks = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  const value = useMemo<TaskBoardContextValue>(
    () => ({
      tasks,
      groupedTasks,
      loading,
      error,
      joinedRoom,
      refreshTasks,
      moveTask,
      createTask,
      creatingTask,
      updateTask: updateInfoTask,
      updatingTask,
    }),
    [tasks, groupedTasks, loading, error, joinedRoom, refreshTasks, moveTask],
  );

  return (
    <TaskBoardContext.Provider value={value}>
      {children}
    </TaskBoardContext.Provider>
  );
}

export function useTaskBoard() {
  const context = useContext(TaskBoardContext);
  if (!context) {
    throw new Error("useTaskBoard must be used inside TaskBoardProvider");
  }
  return context;
}
