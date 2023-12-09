import { useEffect } from "react";
import { db } from "../firebase/firebaseClient";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  setSources,
  selectProjectId,
} from "../../../redux/slices/projectSlice";

export const useDataSourceListener = () => {
  const projectId = useSelector(selectProjectId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!projectId) return;

    const projectDocRef = doc(db, "projects", projectId);
    const dataSourcesCollectionRef = collection(projectDocRef, "dataSources");

    const unsubscribe = onSnapshot(dataSourcesCollectionRef, (snapshot) => {
      const sources = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Transforming the insertedAt field
          insertedAt: data.insertedAt?.toDate().toLocaleDateString(),
          // Transforming the createdAt field if it exists
          createdAt: data.createdAt
            ? data.createdAt.toDate().toLocaleDateString()
            : undefined,
        };
      });
      console.log("sources: ", sources);
      dispatch(setSources(sources));
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [projectId, dispatch]);
};
