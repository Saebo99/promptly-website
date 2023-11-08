import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  selectProjectId,
  setCurrentProject,
} from "../../../redux/slices/projectSlice";

import { db } from "../firebase/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";

export const useProjectListener = () => {
  console.log("useFirestoreListener");
  const dispatch = useDispatch();
  const projectId = useSelector(selectProjectId);

  useEffect(() => {
    if (projectId) {
      // Create a reference to the document you want to listen to
      const docRef = doc(db, "projects", projectId);

      // Attach a listener to the document reference
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const updatedProjectData = docSnapshot.data();
          // Dispatch an action to update the Redux state
          dispatch(setCurrentProject(updatedProjectData));
        }
      });

      // Detach the listener when the component unmounts or currentProjectId changes
      return () => unsubscribe();
    }
  }, [projectId, dispatch]);
};
