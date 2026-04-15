import {
  getTaskListApi,
  UpdateStatusTaskApi,
  CreateNewTaskApi,
  UpdateInfoTaskApi,
} from "./api";
import {
  setTasks,
  setLoading,
  setError,
  setCreating,
  setUpdating,
  upsertTask,
} from "./taskSlice";
import { AppDispatch, RootState } from "@/store";
import { CreateTaskDto, TaskStatus, UpdateTaskInfoDto } from "./types";

export const fetchTasks =
  (workspaceId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await getTaskListApi(workspaceId);
      dispatch(setTasks(res.value ?? []));
    } catch {
      dispatch(setError("Không tải được task"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const moveTaskThunk =
  (taskId: string, nextStatus: TaskStatus, nextOrder: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const prev = getState().task.byId[taskId];

    // optimistic
    dispatch(upsertTask({ ...prev, status: nextStatus, order: nextOrder }));

    try {
      await UpdateStatusTaskApi({
        task_id: taskId,
        status: nextStatus,
        order: nextOrder,
      });
    } catch {
      dispatch(upsertTask(prev));
    }
  };

export const createTaskThunk =
  (payload: CreateTaskDto) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setCreating(true));
      await CreateNewTaskApi(payload);
    } finally {
      dispatch(setCreating(false));
    }
  };

export const updateTaskThunk =
  (id: string, payload: UpdateTaskInfoDto) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setUpdating(true));
      await UpdateInfoTaskApi(id, payload);
    } finally {
      dispatch(setUpdating(false));
    }
  };
