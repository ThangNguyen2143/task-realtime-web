import WorkspaceDetailClient from "./client";

async function WorkspaceDetail(props: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await props.params;
  return (
    <div>
      <WorkspaceDetailClient workspaceId={workspaceId} />
    </div>
  );
}

export default WorkspaceDetail;
