import { createBrowserRouter } from "react-router-dom";
import Landing from "../Pages/Landing";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import ErrorPage from "../Pages/Error";
import Layout from "../components/Layout";
import UserPostForm from "../Pages/CreatePost";
import Post from "../Pages/Post";
import PrivateRoutes from "../components/PrivateRoutes";
import Drafts from "../Pages/Drafts";
import Draft from "../Pages/Draft";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "/drafts",
        element: <Drafts />,
      },
      {
        path: "create",
        element: <PrivateRoutes />,
        children: [
          {
            path: "/create",
            element: <UserPostForm />,
          },
        ],
      },
      {
        path: "post/:postId",
        element: <Post />,
      },
      {
        path: "draft/:draftId",
        element: <Draft />,
      },
    ],
  },
]);
