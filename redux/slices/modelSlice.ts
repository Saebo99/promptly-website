import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ModelState {
  modelId: string;
  usingPromptEngineer: boolean;
  generatedPrompt: string;
}

const initialState: ModelState = {
  modelId: "",
  usingPromptEngineer: false,
  generatedPrompt: "",
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelId: (state, action: PayloadAction<string>) => {
      state.modelId = action.payload;
    },
    setUsingPromptEngineer: (state, action: PayloadAction<boolean>) => {
      state.usingPromptEngineer = action.payload;
    },
    setGeneratedPrompt: (state, action: PayloadAction<string>) => {
      state.generatedPrompt = action.payload;
    },
  },
});

export const { setModelId, setUsingPromptEngineer, setGeneratedPrompt } =
  modelSlice.actions;

export const selectModelId = (state: RootState) => state.model.modelId;
export const selectUsingPromptEngineer = (state: RootState) =>
  state.model.usingPromptEngineer;
export const selectGeneratedPrompt = (state: RootState) =>
  state.model.generatedPrompt;
