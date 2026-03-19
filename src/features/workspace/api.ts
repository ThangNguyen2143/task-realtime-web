import { api } from "@/lib/api";
import type {
  CreateWorkspaceDto,
  CreateWsResponse,
  InviteMemberDto,
  InviteResponse,
  UpdateWsResponse,
  WorkspaceDetail,
  WorkspaceDisplay,
} from "./types";

export async function getWorkspaceListApi() {
  return api.get<WorkspaceDisplay[]>("/workspace", {
    auth: true,
  });
}
export async function inviteMemberToWorkspaceApi(payload: InviteMemberDto) {
  return api.post<InviteResponse, InviteMemberDto>(
    "/workspace/invite-member",
    payload,
    {
      auth: true,
    },
  );
}
export async function getDetailWorkspaceApi(id: string) {
  return api.get<WorkspaceDetail>("/workspace/" + id, {
    auth: true,
  });
}
export async function CreateWorkSpaceApi(payload: CreateWorkspaceDto) {
  return api.post<CreateWsResponse, CreateWorkspaceDto>("/workspace", payload, {
    auth: true,
  });
}
export async function UpdateInfoWorkSpaceApi(
  id: string,
  payload: CreateWorkspaceDto,
) {
  return api.put<UpdateWsResponse, CreateWorkspaceDto>(
    "/workspace/" + id,
    payload,
    {
      auth: true,
    },
  );
}
export async function deleteWorkspaceApi(id: string) {
  return api.delete<CreateWsResponse>("/workspace/" + id, {
    auth: true,
  });
}
