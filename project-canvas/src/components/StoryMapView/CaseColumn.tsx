import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ActionCard } from "./Cards/ActionCard"
import { AddSubActionCard } from "./Cards/AddSubActionCard"
import { CaseTitleCard } from "./Cards/CaseTitleCard"
import { getRndInteger } from "./helpers/utils"
import { Case, Action } from "./types"

export function CaseColumn({
  id: caseId,
  title,
  actions,
  addAction,
  editAction,
}: Case & {
  addAction: (caseId: string, action: Action) => void
  editAction: ({ id, title }: Action) => void
}) {
  return (
    <Stack>
      <CaseTitleCard title={title} />

      <StrictModeDroppable droppableId={caseId} direction="horizontal">
        {(provided) => (
          <Group
            bg="gray.2"
            spacing={0}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {actions.map((action, index) => (
              <ActionCard
                key={action.id}
                id={action.id}
                index={index}
                editAction={editAction}
              >
                {action.title}
              </ActionCard>
            ))}
            <AddSubActionCard
              id={`action-add-${caseId}`}
              index={actions.length}
              onClick={() =>
                addAction(caseId, {
                  id: `s-${getRndInteger()}`,
                  title: "New Action",
                  subActions: [],
                })
              }
            />
            {provided.placeholder}
          </Group>
        )}
      </StrictModeDroppable>
    </Stack>
  )
}