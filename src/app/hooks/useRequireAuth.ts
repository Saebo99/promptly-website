import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; // Import RootState from your store

export const useRequireAuth = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);
};
