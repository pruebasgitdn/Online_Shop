import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Layout from "./components/Layout.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Category from "./pages/Category.tsx";
import Cancel from "./pages/Cancel.tsx";
import Succes from "./pages/Succes.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProductCard from "./components/ProductCard.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import Cart from "./pages/Cart.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Favorites from "./pages/Favorites.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

import CompleteProfile from "./pages/CompleteProfile.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import MyOrders from "./pages/MyOrders.tsx";

const RouterLayout = () => {
  return (
    <Layout>
      <ToastContainer position="bottom-right" />
      {/* Renderizado de rutas hijas y prop children */}
      <Outlet />
    </Layout>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterLayout />,
    children: [
      {
        path: "/", //Children del Layout
        element: <App />,
      },
      {
        path: "/product/",
        element: <ProductCard />,
      },
      {
        path: "/product/:id",
        element: <ProductCard />,
      },
      {
        path: "/category",
        element: <Category />,
      },

      {
        path: "/success",
        element: <Succes />,
      },

      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/cancel",
        element: <Cancel />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/complete-profile",
        element: <CompleteProfile />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/orders",
            element: <MyOrders />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
