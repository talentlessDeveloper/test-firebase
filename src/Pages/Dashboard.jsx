import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserPosts from "../components/UserPosts";

const Dashboard = () => {
  const [active, setActive] = useState("posts");
  const navigate = useNavigate();

  const handleDrafts = () => {
    setActive("drafts");
    navigate("/dashboard/drafts");
  };

  const handlePosts = () => {
    setActive("posts");
    navigate("/dashboard");
  };

  return (
    <div>
      <div className='container mx-auto p-5'>
        <h2>Dashboard!</h2>
        <div>
          <div className='flex gap-x-4'>
            <button
              className={`pb-1 border-b-2 border-solid ${
                active === "posts" ? "border-b-slate-600" : null
              }`}
              onClick={handlePosts}
            >
              Posts
            </button>
            <button
              className={`pb-1 border-b-2 border-solid ${
                active !== "posts" ? "border-b-slate-600" : null
              }`}
              onClick={handleDrafts}
            >
              Drafts
            </button>
          </div>
          <div className='mt-5'>
            {active === "posts" ? <UserPosts /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
