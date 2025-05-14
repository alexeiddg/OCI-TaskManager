import {SprintStatus} from "@/lib/types/enums/SprintStatus";

export interface TeamCreationFormValues {
  teamName: string;
  managerId?: string;
  projectName: string;
  projectDescription: string;
  sprintName: string;
  startDate: string;
  endDate: string;
  sprintDescription: string;
  sprintStatus: SprintStatus;
}
