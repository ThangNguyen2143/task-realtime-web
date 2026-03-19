export type WorkspaceDisplay = {
  id: string;
  workspaceName: string;
  description: string;
  role: WorkspaceRole;
  joinAt: Date;
};
export type WorkspaceDetail = {
  id: string;
  workspaceName: string;
  description: string | null;
  createAt: Date;
  updateAt: Date;
  ownerId: string;
  members: Member[];
};
export type Member = {
  id: string;
  role: WorkspaceRole;
  joinAt: Date;
  userId: string;
  workspaceId: string;
  nameDisplay: string;
};

export enum WorkspaceRole {
  OWNER,
  MEMBER,
}
export type CreateWorkspaceDto = {
  workspaceName: string;
  description: string;
};
export type CreateWsResponse = UpdateWsResponse & {
  description: string;
  createAt: Date;
  ownerId: string;
};
export type UpdateWsResponse = {
  id: string;
  workspaceName: string;
};
export type InviteMemberDto = {
  workspaceId: string;
  email: string;
};
export type InviteResponse = {
  id: string;
  role: WorkspaceRole;
  joinAt: Date;
  userId: string;
  workspaceId: string;
};
