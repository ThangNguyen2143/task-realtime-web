"use client";

import { useAuthMiddleware } from "@/components/auth/auth-middleware";
import { useAuthContext } from "@/components/auth/context";
import { TaskBoard } from "@/components/tasks/Task-board";
import { TaskBoardProvider } from "@/components/tasks/task-context";
import SliderWorkspaceDetail from "@/components/workspace/slider-workspace-detail";
import { useWorkspaceDetail } from "@/features/workspace/hook";

export default function WorkspaceDetailClient({
  workspaceId,
}: {
  workspaceId: string;
}) {
  useAuthMiddleware({
    requireAuth: true,
    redirectTo: "/login",
  });
  const { data, loading, error, refresh } = useWorkspaceDetail(workspaceId);
  const { user } = useAuthContext();
  if (loading) return <div>Đang tải chi tiết workspace...</div>;
  if (error) return <div>{error}</div>;
  if (!data || !user) return <div>Không có dữ liệu workspace</div>;

  return (
    <div className="space-y-4">
      <div className="drawer">
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="flex mb-2">
            <label htmlFor="my-drawer-1" className="btn drawer-button">
              Chi tiết
            </label>
          </div>
          <TaskBoardProvider workspaceId={workspaceId} userId={user.id}>
            <TaskBoard workspaceId={workspaceId} />
          </TaskBoardProvider>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-1"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <SliderWorkspaceDetail workspaceInfo={data} onRefresh={refresh} />
        </div>
      </div>
    </div>
  );
}
