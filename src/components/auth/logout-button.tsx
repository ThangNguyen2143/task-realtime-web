"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth/context";
import { logoutApi } from "@/features/auth/api";

function LogoutButton() {
  const router = useRouter();
  const { clearAuth } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await logoutApi();
    } catch (error) {
      // lỗi cũng vẫn logout client (đừng chặn user)
      console.error("Logout API error:", error);
    } finally {
      // luôn clear phía client
      clearAuth();

      // redirect về login
      router.replace("/login");

      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading} className="btn btn-ghost">
      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}

export default LogoutButton;
