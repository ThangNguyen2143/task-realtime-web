import { useDispatch } from "react-redux";
import { upsertTask, removeTask, mergeTasks, setJoinedRoom } from "./taskSlice";
import { useTaskSocket } from "./use-task-socket";
import { convertToTaskItem } from "./util";

export const useTaskRealtime = (workspaceId: string, userId: string) => {
  const dispatch = useDispatch();

  useTaskSocket({
    workspaceId,
    userId,
    onJoined: () => dispatch(setJoinedRoom(true)),
    onCreated: (p) => dispatch(upsertTask(p.task)),
    onUpdated: (p) => dispatch(upsertTask(p.task)),
    onStatusUpdated: (p) => dispatch(mergeTasks(convertToTaskItem(p.tasks))),
    onDeleted: (p) => dispatch(removeTask(p.taskId)),
  });
};
