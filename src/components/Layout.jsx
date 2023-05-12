import { Link, Outlet } from "react-router-dom";

import { useAuthStatus } from "../hooks/UseAuth";

const Layout = () => {
  const { user, loading, handleLogOut } = useAuthStatus();

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
            <li>
              <Link to='/drafts'>Drafts </Link>
            </li>

            {user ? (
              <li>
                <button
                  onClick={handleLogOut}
                  className='bg-gray-700 text-gray-50 text-sm uppercase py-2 px-4'
                >
                  {" "}
                  Log out
                </button>
              </li>
            ) : (
              <li>
                <Link to='/sign-in'>Sign In</Link>
              </li>
            )}
            <li>{user ? <p>Hello {user}</p> : null}</li>
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
