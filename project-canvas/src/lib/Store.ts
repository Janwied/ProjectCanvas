import { IssueType, Project } from "project-extender"
import { create } from "zustand"

export interface CanvasStore {
  projects: Project[]
  selectedProject: Project | undefined
  selectedProjectBoardIds: number[]
  issueTypes: IssueType[]
  setProjects: (projects: Project[]) => void
  setSelectedProject: (project: Project) => void
  setselectedProjectBoardIds: (boards: number[]) => void
  setIssueTypes: (types: IssueType[]) => void
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
  projects: [],
  selectedProject: undefined,
  selectedProjectBoardIds: [],
  issueTypes: [],
  setProjects: (projects: Project[]) => set(() => ({ projects })),
  setselectedProjectBoardIds: (boards: number[]) =>
    set(() => ({ selectedProjectBoardIds: boards })),
  setSelectedProject: (row: Project | undefined) =>
    set(() => ({ selectedProject: row })),
  setIssueTypes: (types: IssueType[]) => set(() => ({ issueTypes: types })),
}))
