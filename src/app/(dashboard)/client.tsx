"use client";
import { useAuthMiddleware } from "@/components/auth/auth-middleware";

function HomeClient() {
  useAuthMiddleware({
    requireAuth: true,
  });
  return <div>Home page</div>;
}

export default HomeClient;
