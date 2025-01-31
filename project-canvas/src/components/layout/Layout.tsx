import { AppShell } from "@mantine/core"
import { Outlet } from "react-router-dom"
import { LayoutHeader } from "./LayoutHeader"

export function Layout() {
  return (
    <AppShell
      padding="md"
      header={<LayoutHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  )
}
