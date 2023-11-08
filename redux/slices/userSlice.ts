import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { doc, onSnapshot, Firestore } from "firebase/firestore";

// ...

interface UserState {
  user: any;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export const addUserListener =
  (
    db: Firestore,
    userId: string,
    listenerRef: React.MutableRefObject<(() => void) | null>
  ) =>
  (dispatch: any): void => {
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      dispatch(setUser(doc.data()));
    });
    listenerRef.current = unsubscribe;
  };

export const removeUserListener =
  (listenerRef: React.MutableRefObject<(() => void) | null>) =>
  (dispatch: any): void => {
    if (listenerRef.current) {
      listenerRef.current();
      listenerRef.current = null;
    }
  };
