"use client";

import { UpdateTaskInfoDto } from "@/features/task/types";
import { useState } from "react";

export function AddTaskInline({
  onSubmit,
  loading,
}: {
  onSubmit: (payload: UpdateTaskInfoDto) => Promise<void>;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      await onSubmit({
        title: trimmed,
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn-ghost w-full justify-start border border-dashed"
        onClick={() => setOpen(true)}
      >
        + Add task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-base-100 p-3 shadow-sm"
    >
      <div className="space-y-3">
        <input
          autoFocus
          className="input w-full"
          placeholder="Nhập tiêu đề task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          autoFocus
          className="input w-full"
          placeholder="Nhập mô tả task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading || !title.trim()}
          >
            {loading ? "Đang tạo..." : "Thêm"}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setOpen(false);
              setTitle("");
            }}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
}
