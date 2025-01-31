import { Button, Container, Divider, Group, Image, Paper } from "@mantine/core"
import { IconCloud, IconServer } from "@tabler/icons"
import { ipcRenderer } from "electron"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { LanguageSelector } from "../common/LanguageSelector"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { JiraCloudLogin } from "./jira-cloud/JiraCloudLogin"
import { JiraServerLogin } from "./jira-server/JiraServerLogin"

export function Login() {
  const [providerLogin, setProviderLogin] = useState("")
  const navigateTo = useNavigate()
  const onSuccess = () => navigateTo("/projectsview")
  const goBack = () => setProviderLogin("")
  const { t } = useTranslation("login")

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        p="lg"
        withBorder
        sx={(theme) => ({
          width: "30vw",
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.sm,
          boxShadow: theme.shadows.xl,
          borderRadius: theme.radius.lg,
        })}
      >
        <Group spacing="xs">
          <ColorSchemeToggle ml="auto" />
          <LanguageSelector />
        </Group>
        <Image
          mx="auto"
          src="./project_canvas_logo.svg"
          sx={(theme) => ({
            maxWidth: "220px",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.fn.rgba("#fff", 0.3)
                : "transparent",
            borderRadius: "20px",
            padding: "20px",
          })}
        />

        {providerLogin === "" && (
          <>
            <Divider
              my="lg"
              label={t("choseProvider")}
              labelPosition="center"
            />
            <Button
              size="xl"
              variant="gradient"
              gradient={{
                from: "primaryGreen.5",
                to: "primaryGreen.8",
                deg: 60,
              }}
              leftIcon={<IconServer size={32} strokeWidth={1.8} />}
              onClick={() => {
                setProviderLogin("JiraServer")
              }}
            >
              Jira Server
            </Button>
            <Button
              size="xl"
              variant="gradient"
              gradient={{
                from: "primaryBlue.3",
                to: "primaryBlue.6",
                deg: 60,
              }}
              leftIcon={<IconCloud size={32} strokeWidth={1.8} />}
              onClick={() => {
                setProviderLogin("JiraCloud")
                ipcRenderer.send("start-oauth2")
              }}
            >
              Jira Cloud
            </Button>
          </>
        )}
        {providerLogin === "JiraServer" && (
          <JiraServerLogin onSuccess={onSuccess} goBack={goBack} />
        )}
        {providerLogin === "JiraCloud" && (
          <JiraCloudLogin onSuccess={onSuccess} goBack={goBack} />
        )}
      </Paper>
    </Container>
  )
}
