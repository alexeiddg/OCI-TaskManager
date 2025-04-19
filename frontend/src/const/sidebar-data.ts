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
      title: "Settings (TODO)",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help (TODO)",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search (TODO)",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Reports (TODO)",
      url: "/dashboard/reports",
      icon: IconReport,
    },
    {
      name: "Data Library (TODO)",
      url: "/dashboard/data",
      icon: IconDatabase,
    },
  ],
};
