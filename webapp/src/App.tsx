import {
  AppShell,
  Container,
  Group,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

function App() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const primaryShades = theme.colors[theme.primaryColor]
  const activeColor = colorScheme === 'dark' ? primaryShades[3] : primaryShades[6]
  const inactiveColor = colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7]

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    fontWeight: 600,
    color: isActive ? activeColor : inactiveColor,
  })

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" justify="space-between" px="md">
          <Title order={3} fw={700}>
            webapp
          </Title>
          <Group gap="md" component="nav">
            <NavLink to="/settings" style={linkStyle}>
              Settings
            </NavLink>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg" py="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
