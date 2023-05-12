import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebaseConfig";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (user) {
        setFormData({
          email: "",
          password: "",
        });

        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
      alert(err.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <form
        className='bg-white p-8 rounded shadow-md max-w-xl w-3/4'
        onSubmit={handleSignIn}
      >
        <h2 className='text-2xl font-bold mb-6'>Sign In</h2>
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Sign In
          </button>
          <GoogleAuth />
        </div>
      </form>
      <div className='text-center mt-4'>
        <Link to='/sign-up' className='text-blue-400'>
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
