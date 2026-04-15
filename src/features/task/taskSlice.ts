import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskItem } from "./types";
type TaskState = {
  byId: Record<string, TaskItem>;
  allIds: string[];
  loading: boolean;
  error: string | null;
  creatingTask: boolean;
  updatingTask: boolean;
  joinedRoom: boolean;
};
const initialState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  creatingTask: false,
  updatingTask: false,
  joinedRoom: false,
} as TaskState;

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<TaskItem[]>) {
      const tasks = action.payload;
      state.byId = {};
      state.allIds = [];

      tasks.forEach((t) => {
        state.byId[t.id] = t;
        state.allIds.push(t.id);
      });
    },
    upsertTask(state, action: PayloadAction<TaskItem>) {
      const task = action.payload;
      state.byId[task.id] = task;
      if (!state.allIds.includes(task.id)) {
        state.allIds.push(task.id);
      }
    },
    removeTask(state, action: PayloadAction<string>) {
      const id = action.payload;

      delete state.byId[id];
      state.allIds = state.allIds.filter((i) => i !== id);
    },

    mergeTasks(state, action: PayloadAction<TaskItem[]>) {
      action.payload.forEach((task) => {
        state.byId[task.id] = {
          ...state.byId[task.id],
          ...task,
        };
      });
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setCreating(state, action: PayloadAction<boolean>) {
      state.creatingTask = action.payload;
    },

    setUpdating(state, action: PayloadAction<boolean>) {
      state.updatingTask = action.payload;
    },

    setJoinedRoom(state, action: PayloadAction<boolean>) {
      state.joinedRoom = action.payload;
    },
  },
});
export const {
  setTasks,
  upsertTask,
  removeTask,
  mergeTasks,
  setLoading,
  setError,
  setCreating,
  setUpdating,
  setJoinedRoom,
} = taskSlice.actions;

export default taskSlice.reducer;
