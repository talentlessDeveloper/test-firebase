import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import GoogleAuth from "../components/GoogleAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: formData.name,
      });

      const formCopy = { ...formData };
      delete formCopy.password;
      formCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formCopy);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      navigate("/");
    } catch (err) {
      console.log(err.message);
      alert(err.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <form
        className='bg-white p-8 rounded shadow-md max-w-xl w-3/4'
        onSubmit={handleSignUp}
      >
        <h2 className='text-2xl font-bold mb-6'>Create Account</h2>
        <div className='mb-4'>
          <label className='block font-bold text-gray-700 mb-2' htmlFor='email'>
            Name
          </label>
          <input
            className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='name'
            type='name'
            placeholder='Enter your name'
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className='mb-4'>
          <label className='block font-bold text-gray-700 mb-2' htmlFor='email'>
            Email
          </label>
          <input
            className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='email'
            type='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </div>
        <div className='mb-6'>
          <label
            className='block font-bold text-gray-700 mb-2'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='password'
            type='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Sign Up
          </button>

          <GoogleAuth />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
