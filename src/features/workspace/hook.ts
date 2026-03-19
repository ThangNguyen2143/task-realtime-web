"use client";

import { useCallback, useEffect, useState } from "react";
import type { WorkspaceDetail } from "@/features/workspace/types";
import { getDetailWorkspaceApi } from "@/features/workspace/api";
import { useWorkspaceContext } from "@/components/workspace/workspace-contex";

type UseWorkspaceDetailResult = {
  data: WorkspaceDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useWorkspaceDetail(id?: string): UseWorkspaceDetailResult {
  const [data, setData] = useState<WorkspaceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const res = await getDetailWorkspaceApi(id);
      setData(res.value ?? null);
    } catch (err) {
      console.error("getDetailWorkspaceApi error:", err);
      setError("Không thể tải chi tiết workspace");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
export function useWorkspaceList() {
  const {
    workspaces,
    loading,
    error,
    refreshWorkspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
  } = useWorkspaceContext();

  return {
    workspaces,
    loading,
    error,
    refreshWorkspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
  };
}

export function useWorkspaceActions() {
  const { createWorkspace, updateWorkspace, deleteWorkspace, creating, error } =
    useWorkspaceContext();

  return {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    creating,
    error,
  };
}
