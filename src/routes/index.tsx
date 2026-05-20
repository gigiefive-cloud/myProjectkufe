import { useRoutes } from "react-router-dom";
// import dashboardRoutes from "../modules/dashboard/routes";
import authRoutes from "../modules/auth/routes";
// import productRoutes from "../modules/products/routes";
// import { landingRoutes } from "../modules/landing/routes";

export default function AppRoutes() {
  return useRoutes([
    ...authRoutes,
    // ...dashboardRoutes,
    // ...productRoutes,
    // ...landingRoutes,
  ]);
}