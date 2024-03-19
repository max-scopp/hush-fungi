import { createMemoryRouter, redirect } from "react-router-dom";
import { HassConnectionPhase } from "../main/hass/HassConnectionPhase";
import { Home } from "./pages/Home";
import { NoRoute } from "./pages/NoRoute";
import { Setup } from "./pages/Setup";

export const router = createMemoryRouter([
  {
    index: true,
    element: <Home />,
    loader: async () => {
      const phase = window.electron.remote.getGlobal(
        "hassConnectionPhase",
      ) as HassConnectionPhase;

      switch (phase) {
        case "connected":
          return null;
        case "hass-not-known":
        case "failed-auth":
          return redirect("/setup");
        // case "failed-auth":
        //   return redirect("/auth-failed");
        default:
          throw Error("Invalid phase for home route " + phase);
      }
    },
  },
  { path: "/setup", element: <Setup /> },
  { path: "*", element: <NoRoute /> },
]);
