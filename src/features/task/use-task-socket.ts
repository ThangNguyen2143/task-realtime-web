"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  TaskDeletedSocketPayload,
  TaskRealtimeWithTaskPayload,
  TaskUpdateStatusSocketPayload,
} from "./types";

type JoinRoomSuccessPayload = {
  workspaceId: string;
  room: string;
};

export function useTaskSocket({
  workspaceId,
  userId,
  onJoined,
  onCreated,
  onUpdated,
  onStatusUpdated,
  onDeleted,
}: {
  workspaceId: string;
  userId: string;
  onJoined?: (payload: JoinRoomSuccessPayload) => void;
  onCreated?: (payload: TaskRealtimeWithTaskPayload) => void;
  onUpdated?: (payload: TaskRealtimeWithTaskPayload) => void;
  onStatusUpdated?: (payload: TaskUpdateStatusSocketPayload) => void;
  onDeleted?: (payload: TaskDeletedSocketPayload) => void;
}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!workspaceId || !userId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", {
        workspaceId,
        userId,
      });
    });

    socket.on("join-room-success", (payload: JoinRoomSuccessPayload) => {
      onJoined?.(payload);
    });

    socket.on("created", (payload: TaskRealtimeWithTaskPayload) => {
      onCreated?.(payload);
    });

    socket.on("updated", (payload: TaskRealtimeWithTaskPayload) => {
      onUpdated?.(payload);
    });

    socket.on("statusUpdate", (payload: TaskUpdateStatusSocketPayload) => {
      onStatusUpdated?.(payload);
    });

    socket.on("delete", (payload: TaskDeletedSocketPayload) => {
      onDeleted?.(payload);
    });

    socket.on("connect_error", (error) => {
      console.error("socket connect_error", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("join-room-success");
      socket.off("created");
      socket.off("updated");
      socket.off("statusUpdate");
      socket.off("delete");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    workspaceId,
    userId,
    onJoined,
    onCreated,
    onUpdated,
    onStatusUpdated,
    onDeleted,
  ]);

  return socketRef;
}
