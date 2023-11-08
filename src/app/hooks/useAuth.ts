import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { setUser } from "../../../redux/slices/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;

        const plainUser = {
          uid,
          displayName,
          email,
          photoURL,
        };
        dispatch(setUser(plainUser));
      } else {
        dispatch(setUser(null));
      }

      setIsAuthChecked(true);
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return isAuthChecked;
};
