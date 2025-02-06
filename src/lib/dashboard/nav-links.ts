import { navPermissionMapping } from "@/src/types";
import {
  LuFileImage,
  LuFileStack,
  LuHome,
  LuMail,
  LuMessageSquare,
  LuSettings,
  LuUsers,
} from "react-icons/lu";

export const dashboardNavLinks = [
  {
    icon: LuHome,
    label: "Overview",
    href: "/dashboard/overview",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuFileStack,
    label: "Posts",
    href: "/dashboard/posts",
    permission: navPermissionMapping.VIEW_POSTS,
    children: [
      {
        label: "All Posts",
        href: "/dashboard/posts",
        permission: navPermissionMapping.VIEW_POSTS,
      },
      {
        label: "New Post",
        href: "/dashboard/posts/new",
        permission: navPermissionMapping.CREATE_POST,
      },
    ],
  },
  {
    icon: LuUsers,
    label: "Users",
    href: "/dashboard/users",
    permission: navPermissionMapping.VIEW_USERS,
  },
  {
    icon: LuFileImage,
    label: "Media",
    href: "/dashboard/media",
    permission: navPermissionMapping.VIEW_MEDIA,
  },
  {
    icon: LuMessageSquare,
    label: "Comments",
    href: "/dashboard/comments",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuMail,
    label: "Newsletter",
    href: "/dashboard/newsletter",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuSettings,
    label: "Settings",
    href: "/dashboard/settings",
    permission: navPermissionMapping.VIEW_SETTINGS,
  },
];
