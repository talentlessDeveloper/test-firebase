import { Link, Outlet } from "react-router-dom";

import { useAuthStatus } from "../hooks/UseAuth";
import { useState } from "react";

import Avatar from "../assets/undraw_male_avatar_g98d.svg";

const Layout = () => {
  const { user, loading, handleLogOut } = useAuthStatus();
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) return <div>Loading...</div>;

  console.log(user);
  return (
    <section className='grid grid-cols-1 grid-rows-[80px_minmax(450px,_auto)_1fr] min-h-screen'>
      <header>
        <nav className='container mx-auto flex justify-between py-5'>
          <Link to='/' className='text-2xl'>
            Kaffy Firebase
          </Link>
          <ul className='flex gap-x-2 items-center font-medium text-lg'>
            <li>
              <Link to='/create'>Create </Link>
            </li>

            {user ? (
              <>
                <li>
                  <button onClick={() => setShowDropdown((d) => !d)}>
                    <img
                      src={Avatar}
                      alt={user}
                      className='w-10 h-10 object-cover'
                    />
                  </button>
                </li>
                <ul
                  className={`w-11/12 max-w-[180px] p-3 bg-gray-100 space-y-3 fixed right-12 top-[4.5rem] transition-all duration-500 ${
                    showDropdown ? "block" : "hidden"
                  }`}
                  key='dropdown-menu'
                >
                  <li className='pt-2 pb-4 border-b border-b-slate-800'>
                    {user}
                  </li>
                  <li>
                    <Link to='/dashboard'>Dashboard </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogOut}
                      className='bg-gray-700 text-gray-50 text-sm uppercase py-2 px-4'
                    >
                      {" "}
                      Log out
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <li>
                <Link to='/sign-in'>Sign In</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div className='container mx-auto p-8 text-left text-2xl'>
          This is the footer
        </div>
      </footer>
    </section>
  );
};

export default Layout;
