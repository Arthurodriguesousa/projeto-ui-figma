import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Home } from "./components/Home";
import { Community } from "./components/Community";
import { History } from "./components/History";
import { Settings } from "./components/Settings";
import { ReportScam } from "./components/ReportScam";
import { Chat } from "./components/Chat";
import { Profile } from "./components/Profile";
import { Privacy } from "./components/Privacy";
import { HelpCenter } from "./components/HelpCenter";
import { ScamDetail } from "./components/ScamDetail";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/profile",
    Component: Profile,
  },
{
    path: "/privacy",
    Component: Privacy,
  },
  {
    path: "/help",
    Component: HelpCenter,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "community", Component: Community },
      { path: "community/:id", Component: ScamDetail },
      { path: "history", Component: History },
      { path: "settings", Component: Settings },
      { path: "report", Component: ReportScam },
      { path: "chat", Component: Chat },
    ],
  },
]);
