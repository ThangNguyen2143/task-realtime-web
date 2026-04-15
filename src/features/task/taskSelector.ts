import { createSelector } from "@reduxjs/toolkit";
import { groupTasksByStatus } from "./util";
import { RootState } from "@/store";

export const selectTasks = (state: RootState) =>
  state.task.allIds.map((id) => state.task.byId[id]);

export const selectGroupedTasks = createSelector([selectTasks], (tasks) =>
  groupTasksByStatus(tasks),
);
