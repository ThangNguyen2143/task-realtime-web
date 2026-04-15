import AppHeader from "@/components/layout/dashboard/header";
import { WorkspaceProvider } from "@/components/workspace/workspace-contex";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container">
      <WorkspaceProvider>
        <AppHeader />
        {children}
      </WorkspaceProvider>
    </div>
  );
}

export default DashboardLayout;
