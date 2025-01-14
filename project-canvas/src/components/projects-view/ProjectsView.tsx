import { Center, Loader, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { Project } from "project-extender"
import { useCanvasStore } from "../../lib/Store"
import { getProjects } from "./queryFetchers"
import { ProjectsTable } from "./Table/ProjectsTable"

export function ProjectsView() {
  const { setProjects } = useCanvasStore()
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    onSuccess: (_projects: Project[]) => {
      setProjects(_projects)
    },
  })

  if (isLoading)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Loader />
      </Center>
    )
  if (projects && projects.length > 0)
    return <ProjectsTable data={projects.map(({ id, ...rest }) => rest)} />

  return (
    <Center style={{ width: "100%", height: "100%" }}>
      <Text>No Projects Found</Text>
    </Center>
  )
}
