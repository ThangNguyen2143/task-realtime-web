"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type {
  CreateWorkspaceDto,
  WorkspaceDisplay,
} from "@/features/workspace/types";
import {
  CreateWorkSpaceApi,
  deleteWorkspaceApi,
  getWorkspaceListApi,
  UpdateInfoWorkSpaceApi,
} from "@/features/workspace/api";

type WorkspaceContextValue = {
  workspaces: WorkspaceDisplay[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  activeWorkspaceId: string | null;
  activeWorkspace: WorkspaceDisplay | null;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (payload: CreateWorkspaceDto) => Promise<string | null>;
  updateWorkspace: (
    id: string,
    payload: CreateWorkspaceDto,
  ) => Promise<boolean>;
  deleteWorkspace: (id: string) => Promise<boolean>;
  setActiveWorkspaceId: (id: string | null) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function extractWorkspaceIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/workspace\/([^/]+)$/);
  return match?.[1] ?? null;
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [workspaces, setWorkspaces] = useState<WorkspaceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(
    null,
  );

  const refreshWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getWorkspaceListApi();
      setWorkspaces(res.value ?? []);
    } catch (err) {
      console.error("getWorkspaceListApi error:", err);
      setError("Không thể tải danh sách workspace");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  useEffect(() => {
    const routeWorkspaceId = extractWorkspaceIdFromPath(pathname);
    if (routeWorkspaceId) {
      setActiveWorkspaceId(routeWorkspaceId);
    }
  }, [pathname]);

  const createWorkspace = useCallback(
    async (payload: CreateWorkspaceDto) => {
      try {
        setCreating(true);
        setError(null);

        const created = await CreateWorkSpaceApi(payload);

        await refreshWorkspaces();

        const newId = created?.value.id ?? null;
        if (newId) {
          setActiveWorkspaceId(newId);
          router.push(`/workspace/${newId}`);
        }

        return newId;
      } catch (err) {
        console.error("CreateWorkSpaceApi error:", err);
        setError("Tạo workspace thất bại");
        return null;
      } finally {
        setCreating(false);
      }
    },
    [refreshWorkspaces, router],
  );

  const updateWorkspace = useCallback(
    async (id: string, payload: CreateWorkspaceDto) => {
      try {
        setError(null);

        await UpdateInfoWorkSpaceApi(id, payload);
        await refreshWorkspaces();

        return true;
      } catch (err) {
        console.error("UpdateInfoWorkSpaceApi error:", err);
        setError("Cập nhật workspace thất bại");
        return false;
      }
    },
    [refreshWorkspaces],
  );

  const deleteWorkspaceAction = useCallback(
    async (id: string) => {
      try {
        setError(null);

        await deleteWorkspaceApi(id);
        await refreshWorkspaces();

        if (activeWorkspaceId === id) {
          setActiveWorkspaceId(null);
          router.push("/workspace");
        }

        return true;
      } catch (err) {
        console.error("deleteWorkspaceApi error:", err);
        setError("Xóa workspace thất bại");
        return false;
      }
    },
    [activeWorkspaceId, refreshWorkspaces, router],
  );

  const activeWorkspace = useMemo(() => {
    if (!activeWorkspaceId) return null;
    return workspaces.find((ws) => ws.id === activeWorkspaceId) ?? null;
  }, [activeWorkspaceId, workspaces]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspaces,
      loading,
      creating,
      error,
      activeWorkspaceId,
      activeWorkspace,
      refreshWorkspaces,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace: deleteWorkspaceAction,
      setActiveWorkspaceId,
    }),
    [
      workspaces,
      loading,
      creating,
      error,
      activeWorkspaceId,
      activeWorkspace,
      refreshWorkspaces,
      createWorkspace,
      updateWorkspace,
      deleteWorkspaceAction,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useWorkspaceContext must be used inside WorkspaceProvider",
    );
  }
  return ctx;
}
