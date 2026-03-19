"use client";

import { useRouter } from "next/navigation";
import { useWorkspaceList } from "@/features/workspace/hook";

export function NavbarWorkspaceSwitcher() {
  const router = useRouter();
  const { workspaces, loading, activeWorkspaceId, setActiveWorkspaceId } =
    useWorkspaceList();

  const handleChange = (value: string) => {
    if (!value) return;
    setActiveWorkspaceId(value);
    router.push(`/workspace/${value}`);
  };

  return (
    <select
      className="select select-bordered w-64"
      value={activeWorkspaceId ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
    >
      <option value="" disabled>
        {loading ? "Đang tải workspace..." : "Chọn workspace"}
      </option>

      {workspaces.map((ws) => (
        <option key={ws.id} value={ws.id}>
          {ws.workspaceName}
        </option>
      ))}
    </select>
  );
}
