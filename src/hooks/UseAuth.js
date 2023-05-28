import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router";

export const useAuthStatus = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
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

  return {
    user: user.displayName,
    loading,
    handleLogOut,
    imageUrl: user.photoUrl,
  };
};
