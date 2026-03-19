"use client";
import { useAuthMiddleware } from "@/components/auth/auth-middleware";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddWorkspaceForm from "@/components/workspace/add-workspace-form";
import { useState } from "react";

function WorkspaceClient() {
  const [showAddModal, setShowAddModal] = useState(false);
  useAuthMiddleware({
    requireAuth: true,
    redirectTo: "/login",
  });
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4">
      <h2 className="text-2xl">Bạn muốn tạo workspace?</h2>
      <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
        <FontAwesomeIcon icon={faPlus} />
        Tạo workspace
      </button>
      <input
        type="checkbox"
        className="modal-toggle"
        checked={showAddModal}
        readOnly
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <AddWorkspaceForm />
        </div>
        <label
          className="modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          Đóng
        </label>
      </div>
    </div>
  );
}

export default WorkspaceClient;
