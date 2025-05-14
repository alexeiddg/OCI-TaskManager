import { SprintStatus } from "@/lib/types/enums/SprintStatus";

export interface TeamCreationRequest {
  teamName: string;
  // invitedEmails: string[];
  project: {
    name: string;
    description: string;
  };
  sprint: {
    name: string;
    startDate: string;
    endDate: string;
    sprintDescription: string;
    sprintStatus: SprintStatus;
  };
}
