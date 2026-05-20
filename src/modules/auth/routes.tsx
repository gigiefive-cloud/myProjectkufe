import Login from "./pages/Login";
// import Register from "./pages/Register";
const authRoutes = [
  {
    path: "/auth",
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
    //   {
    //     path: "/auth/register",
    //     element: <Register />,
    //   },
    ],
  },
];

export default authRoutes;