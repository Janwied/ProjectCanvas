import {
  Text,
  Group,
  Paper,
  FileButton,
  Button,
  ActionIcon,
  Card,
  HoverCard,
  Image,
  Flex,
  Box,
  Tooltip,
  Center,
  LoadingOverlay,
} from "@mantine/core"
import { IconCloudDownload, IconPlus, IconTrash } from "@tabler/icons"
import { showNotification } from "@mantine/notifications"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import FileSaver from "file-saver"
import { Attachment } from "project-extender"
import { addAttachmentMutation, deleteAttachmentMutation } from "./queries"
import {
  downloadAttachment,
  getAttachmentThumbnail,
  getResource,
} from "./queryFunctions"

export function Attachments(props: {
  issueKey: string
  attachments: Attachment[]
}) {
  const resourceQuery = useQuery({
    queryKey: ["resource"],
    queryFn: getResource,
  })

  const resource = resourceQuery?.data

  const fetchThumb = (id: string): Promise<string | undefined> =>
    getAttachmentThumbnail(id, resource!)
      .then((b) => URL.createObjectURL(b))
      .catch(() => undefined)

  const { data: thumbnails, isLoading: thumbnailsLoading } = useQuery({
    queryKey: ["thumbnails", props.attachments],
    queryFn: async () => {
      const thumbnailPromises = props.attachments.map(async (attachment) => ({
        id: attachment.id,
        url: await fetchThumb(attachment.id),
      }))
      const thumbnailResults = await Promise.all(thumbnailPromises)
      return thumbnailResults
    },
    enabled: !!resource,
  })

  const queryClient = useQueryClient()
  const addAttachmentMutationLocal = addAttachmentMutation(queryClient)
  const deleteAttachmentMutationLocal = deleteAttachmentMutation(queryClient)

  const performDelete = (attachmentId: string): void => {
    if (resource)
      deleteAttachmentMutationLocal.mutate({ attachmentId, resource })
  }

  const performUpload = async (f: File): Promise<void> => {
    const form = new FormData()
    form.append("file", f, f.name)
    const issueIdOrKey = props.issueKey
    if (resource)
      addAttachmentMutationLocal.mutate({ issueIdOrKey, resource, form })
  }

  const label: string =
    props.attachments.length === 0
      ? "Attachments"
      : `Attachments (${props.attachments.length})`

  return (
    <>
      <Group position="left" align="flex-start" spacing="xs">
        <Text color="dimmed" mb="sm">
          {label}
        </Text>
        <Group position="center">
          <FileButton onChange={performUpload} accept="*/*">
            {(properties) => (
              <Button
                {...properties}
                variant="subtle"
                color="dark"
                radius="xs"
                size="xs"
                compact
              >
                <IconPlus color="black" />
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>
      <Paper mb="lg" mr="sm">
        {resource && (
          <Group>
            {props.attachments.map((attachment: Attachment) => {
              const fetchFile: Promise<Blob> = downloadAttachment(
                attachment.id,
                resource
              )
              const handleDownload = () => {
                fetchFile
                  .then((blob) => FileSaver.saveAs(blob, attachment.filename))
                  .catch(() =>
                    showNotification({
                      message: `File couldn't be uploaded! 😢`,
                      color: "red",
                    })
                  )
              }

              return (
                <Tooltip label={attachment.filename} key={attachment.id} inline>
                  <Box>
                    <HoverCard
                      shadow="md"
                      position="top-end"
                      key={attachment.id}
                      offset={-20}
                    >
                      <Card shadow="sm" radius="md" w={150} h={180} withBorder>
                        <HoverCard.Target>
                          <Flex
                            direction="column"
                            justify="space-between"
                            p={0}
                          >
                            <Card.Section>
                              <Center>
                                <LoadingOverlay
                                  overlayOpacity={0.3}
                                  overlayColor="#c5c5c5"
                                  exitTransitionDuration={5000}
                                  visible={thumbnailsLoading}
                                />

                                <Image
                                  height={100}
                                  fit="contain"
                                  src={
                                    !thumbnailsLoading &&
                                    thumbnails &&
                                    thumbnails.find(
                                      (thumbnail) =>
                                        thumbnail.id === attachment.id
                                    )?.url
                                      ? thumbnails.find(
                                          (thumbnail) =>
                                            thumbnail.id === attachment.id
                                        )?.url
                                      : null
                                  }
                                  alt={`${attachment.filename}`}
                                  withPlaceholder
                                />
                              </Center>
                            </Card.Section>
                            <Card.Section p="xs">
                              <Box>
                                <Text size="xs" color="dimmed" truncate>
                                  {attachment.filename}
                                </Text>
                                <Text
                                  size="xs"
                                  fw={600}
                                  color="dimmed"
                                  truncate
                                >
                                  {new Intl.DateTimeFormat("en-GB", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }).format(new Date(attachment.created))}
                                </Text>
                              </Box>
                            </Card.Section>
                          </Flex>
                        </HoverCard.Target>
                        <HoverCard.Dropdown p={0}>
                          <Group spacing={0}>
                            <ActionIcon
                              color="dark"
                              size="lg"
                              radius="xs"
                              variant="outline"
                            >
                              <IconCloudDownload
                                color="black"
                                onClick={handleDownload}
                              />
                            </ActionIcon>

                            <ActionIcon
                              size="lg"
                              color="black"
                              radius="xs"
                              variant="outline"
                              onClick={() => performDelete(attachment.id)}
                            >
                              <IconTrash color="black" />
                            </ActionIcon>
                          </Group>
                        </HoverCard.Dropdown>
                      </Card>
                    </HoverCard>
                  </Box>
                </Tooltip>
              )
            })}
          </Group>
        )}
      </Paper>
    </>
  )
}