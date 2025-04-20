import {
  IconChartBar,
  IconDatabase,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

export const sidebarData = {
  navMain: [
    {
      title: "Workspace",
      url: "/dashboard",
      icon: IconFileDescription,
    },
    {
      title: "Sprints",
      url: "/dashboard/sprints",
      icon: IconListDetails,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: IconFolder,
    },
    {
      title: "Team (TODO)",
      url: "/dashboard/team",
      icon: IconUsers,
    },
    {
      title: "Analytics (TODO)",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Reports (Coming Soon)",
      url: "/dashboard/reports",
      icon: IconReport,
    },
    {
      name: "Data Library (Coming Soon)",
      url: "/dashboard/data",
      icon: IconDatabase,
    },
  ],
};
