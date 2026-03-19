"use client";
import {
  useWorkspaceActions,
  useWorkspaceList,
} from "@/features/workspace/hook";
import { useState } from "react";

function AddWorkspaceForm() {
  const { createWorkspace, creating } = useWorkspaceActions();
  const { workspaces, loading } = useWorkspaceList();

  const [form, setForm] = useState({
    workspaceName: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.workspaceName.trim()) return;

    const id = await createWorkspace({
      workspaceName: form.workspaceName.trim(),
      description: form.description.trim(),
    });

    if (id) {
      setForm({
        workspaceName: "",
        description: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Tạo workspace mới</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="input input-bordered w-full"
              placeholder="Tên workspace"
              value={form.workspaceName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  workspaceName: e.target.value,
                }))
              }
            />

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <button
              className="btn btn-primary"
              type="submit"
              disabled={creating}
            >
              {creating ? "Đang tạo..." : "Tạo workspace"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWorkspaceForm;
