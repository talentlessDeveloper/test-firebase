import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router";

export const useAuthStatus = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.displayName);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogOut = () => {
    auth.signOut();
    setUser("");
    navigate("/");
  };

  return { user, loading, handleLogOut };
};
