import { api } from "@/lib/api";
import {
  CreateTaskDto,
  TaskDeleteResponse,
  TaskItem,
  TaskOnList,
  UpdateTaskInfoDto,
  UpdateTaskStatusDto,
} from "./types";

export async function getTaskListApi(workspaceId: string) {
  return api.get<TaskOnList[]>("/task/workspace/" + workspaceId, {
    auth: true,
  });
}

export async function getDetailTaskApi(id: string) {
  return api.get<TaskItem>("/task/" + id, {
    auth: true,
  });
}

export async function CreateNewTaskApi(payload: CreateTaskDto) {
  return api.post<TaskItem, CreateTaskDto>("/task", payload, {
    auth: true,
  });
}

export async function UpdateInfoTaskApi(
  id: string,
  payload: UpdateTaskInfoDto,
) {
  return api.put<TaskItem, UpdateTaskInfoDto>("/task/" + id, payload, {
    auth: true,
  });
}

export async function UpdateStatusTaskApi(payload: UpdateTaskStatusDto) {
  return await api.put<TaskItem, UpdateTaskStatusDto>(
    "/task/status/update",
    payload,
    {
      auth: true,
    },
  );
}

export async function deleteTaskApi(id: string) {
  return api.delete<TaskDeleteResponse>("/task/" + id, {
    auth: true,
  });
}
