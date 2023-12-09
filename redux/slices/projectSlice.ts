import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ProjectState {
  projectId: string;
  projectIdentifer: string;
  currentProject: {
    id: string;
    name: string;
    projectIdentifier: string;
    team: string[];
    models: {
      modelId: string;
      isActive: boolean;
    };
  };
  whitelistModalOpen: boolean;
}

const initialState: ProjectState = {
  projectId: "",
  projectIdentifer: "",
  currentProject: {
    id: "",
    name: "",
    projectIdentifier: "",
    team: [],
    models: {
      modelId: "",
      isActive: false,
    },
  },
  whitelistModalOpen: false,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
    },
    setProjectIdentifier: (state, action: PayloadAction<string>) => {
      state.projectIdentifer = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<any>) => {
      state.currentProject = action.payload;
    },
    setWhitelistModalOpen: (state, action: PayloadAction<boolean>) => {
      state.whitelistModalOpen = action.payload;
    },
  },
});

export const {
  setProjectId,
  setProjectIdentifier,
  setCurrentProject,
  setWhitelistModalOpen,
} = projectSlice.actions;

export const selectProjectId = (state: RootState) => state.project.projectId;
export const selectProjectIdentifier = (state: RootState) =>
  state.project.projectIdentifer;
export const selectCurrentProject = (state: RootState) =>
  state.project.currentProject;
export const selectWhitelistModalOpen = (state: RootState) =>
  state.project.whitelistModalOpen;
