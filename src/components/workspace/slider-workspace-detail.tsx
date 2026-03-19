"use client";

import { useState } from "react";
import { inviteMemberToWorkspaceApi } from "@/features/workspace/api";
import { WorkspaceDetail } from "@/features/workspace/types";

function SliderWorkspaceDetail({
  workspaceInfo,
  onRefresh,
}: {
  workspaceInfo: WorkspaceDetail;
  onRefresh?: () => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setInviteError("Vui lòng nhập email");
      setInviteMessage(null);
      return;
    }

    try {
      setLoadingInvite(true);
      setInviteError(null);
      setInviteMessage(null);

      await inviteMemberToWorkspaceApi({
        workspaceId: workspaceInfo.id,
        email: trimmedEmail,
      });
      await onRefresh?.();
      setInviteMessage(`Đã gửi lời mời tới ${trimmedEmail}`);
      setEmail("");
    } catch (error: any) {
      console.error(error);
      setInviteError(
        error?.message || "Mời thành viên thất bại, vui lòng thử lại",
      );
    } finally {
      setLoadingInvite(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow min-h-screen">
      <div className="card-body">
        <h1 className="card-title">{workspaceInfo.workspaceName}</h1>
        <p>{workspaceInfo.description ?? "Không có mô tả"}</p>

        <ul className="list rounded-box">
          {workspaceInfo.members.map((mem, i) => (
            <li className="list-row" key={mem.id}>
              <div className="text-2xl font-thin opacity-30 tabular-nums">
                {i + 1}
              </div>

              <div className="list-col-grow">
                <div>{mem.nameDisplay}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {mem.role}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t pt-4">
          <div className="mb-2 text-sm font-semibold opacity-70">
            Mời người khác
          </div>

          <form onSubmit={handleInviteMember} className="space-y-3">
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Nhập email thành viên"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loadingInvite}
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loadingInvite}
            >
              {loadingInvite ? "Đang gửi lời mời..." : "Mời thành viên"}
            </button>
          </form>

          {inviteMessage ? (
            <div className="alert alert-success mt-3 py-2">
              <span>{inviteMessage}</span>
            </div>
          ) : null}

          {inviteError ? (
            <div className="alert alert-error mt-3 py-2">
              <span>{inviteError}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SliderWorkspaceDetail;
