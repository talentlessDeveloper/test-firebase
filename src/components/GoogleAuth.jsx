import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../firebaseConfig";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleSignUpWithGoogle = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // if !user , create user
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <button
      onClick={handleSignUpWithGoogle}
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
    >
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with</p> Google
    </button>
  );
};

export default GoogleAuth;
