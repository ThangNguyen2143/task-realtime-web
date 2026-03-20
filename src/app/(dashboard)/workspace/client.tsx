"use client";
import { useAuthMiddleware } from "@/components/auth/auth-middleware";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddWorkspaceForm from "@/components/workspace/add-workspace-form";
import { useState } from "react";
import { useWorkspaceContext } from "@/components/workspace/workspace-contex";
import Link from "next/link";

function WorkspaceClient() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { workspaces } = useWorkspaceContext();
  useAuthMiddleware({
    requireAuth: true,
  });
  return (
    <div className="flex items-center justify-center min-h-screen gap-4">
      {workspaces.length > 0 && (
        <div className="flex flex-col shadow-2xl rounded-2xl p-5">
          <h2 className="text-2xl">Không gian của bạn</h2>
          <ul className="menu">
            {workspaces.map((ws) => {
              return (
                <li key={ws.id}>
                  <Link href={"/workspace/" + ws.id}>{ws.workspaceName}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl">Bạn muốn tạo không gian mới?</h2>
        <div className="flex">
          <button
            className="btn btn-primary w-fit"
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Tạo workspace
          </button>
        </div>
      </div>
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
