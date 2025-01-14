import { DropResult } from "react-beautiful-dnd"
import { Issue, Sprint } from "project-extender"

export const onDragEnd = ({
  source,
  destination,
  issuesWrappers,
  updateIssuesWrapper,
}: DropResult & {
  issuesWrappers: Map<string, { issues: Issue[]; sprint?: Sprint }>
  updateIssuesWrapper: (
    key: string,
    value: { issues: Issue[]; sprint?: Sprint }
  ) => void
}) => {
  if (destination === undefined || destination === null) return null

  if (
    source.droppableId === destination.droppableId &&
    destination.index === source.index
  )
    return null

  const start = issuesWrappers.get(source.droppableId)!
  const startId = source.droppableId
  const end = issuesWrappers.get(destination.droppableId)!
  const endId = destination.droppableId
  const movedIssueKey = start.issues[source.index].issueKey
  const destinationSprintId = end.sprint?.id

  if (start === end) {
    const newList = start.issues.filter(
      (_: Issue, idx: number) => idx !== source.index
    )
    newList.splice(destination.index, 0, start.issues[source.index])

    const keyOfIssueRankedBefore =
      destination.index === 0 ? "" : newList[destination.index - 1].issueKey
    const keyOfIssueRankedAfter =
      destination.index === newList.length - 1
        ? ""
        : newList[destination.index + 1].issueKey

    if (destinationSprintId) {
      fetch(`${import.meta.env.VITE_EXTENDER}/moveIssueToSprintAndRank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sprint: destinationSprintId,
          issue: movedIssueKey,
          rankBefore: keyOfIssueRankedAfter,
          rankAfter: keyOfIssueRankedBefore,
        }),
      })
    } else if (destination.droppableId === "Backlog") {
      fetch(`${import.meta.env.VITE_EXTENDER}/rankIssueInBacklog`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue: movedIssueKey,
          rankBefore: keyOfIssueRankedAfter,
          rankAfter: keyOfIssueRankedBefore,
        }),
      })
    }

    updateIssuesWrapper(startId, {
      ...start,
      issues: newList,
    })
    return null
  }

  const newStartIssues = start.issues.filter(
    (_: Issue, idx: number) => idx !== source.index
  )
  const newEndIssues = end.issues.slice()
  newEndIssues.splice(destination.index, 0, start.issues[source.index])

  updateIssuesWrapper(startId, {
    ...start,
    issues: newStartIssues,
  })
  updateIssuesWrapper(endId, { ...end, issues: newEndIssues })

  const keyOfIssueRankedBefore =
    destination.index === 0 ? "" : newEndIssues[destination.index - 1].issueKey
  const keyOfIssueRankedAfter =
    destination.index === newEndIssues.length - 1
      ? ""
      : newEndIssues[destination.index + 1].issueKey

  if (destinationSprintId) {
    fetch(`${import.meta.env.VITE_EXTENDER}/moveIssueToSprintAndRank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sprint: destinationSprintId,
        issue: movedIssueKey,
        rankBefore: keyOfIssueRankedAfter,
        rankAfter: keyOfIssueRankedBefore,
      }),
    })
  } else if (destination.droppableId === "Backlog") {
    fetch(`${import.meta.env.VITE_EXTENDER}/rankIssueInBacklog`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue: movedIssueKey,
        rankBefore: keyOfIssueRankedAfter,
        rankAfter: keyOfIssueRankedBefore,
      }),
    }).then(async () => {
      fetch(`${import.meta.env.VITE_EXTENDER}/rankIssueInBacklog`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue: movedIssueKey,
          rankBefore: keyOfIssueRankedAfter,
          rankAfter: keyOfIssueRankedBefore,
        }),
      })
    })
  }

  return null
}
