import { MdDashboard, MdWorkHistory } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoTicketOutline } from "react-icons/io5";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  WORK_HOURS: "/work-hours",
  PROFILE: "/profile",
  ACTIVITY: "/activity",
  DOWNLOAD: "/download",
  TICKETS: "/tickets",
  TICKET_REPLY: "tickets/:id",
};

export const STATUS_COLORS = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  Late: "bg-yellow-100 text-yellow-800",
};

export const SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: MdDashboard,
  },
  {
    id: "work-hours",
    label: "Work Hours",
    path: ROUTES.WORK_HOURS,
    icon: MdWorkHistory,
  },
  {
    id: "profile",
    label: "Profile",
    path: ROUTES.PROFILE,
    icon: FaUser,
  },
  {
    id: "tickets",
    label: "Tickets",
    path: ROUTES.TICKETS,
    icon: IoTicketOutline,
  },
];
