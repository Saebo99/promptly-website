import { createWrapper } from "next-redux-wrapper";
import { store } from "./store";

export const wrapper = createWrapper(() => store, {
  debug: process.env.NODE_ENV === "development",
});
