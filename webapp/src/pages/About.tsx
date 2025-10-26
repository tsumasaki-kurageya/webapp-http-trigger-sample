import { Anchor, Container, List, Text, Title } from '@mantine/core'

function About() {
  return (
    <Container size="sm">
      <Title order={1} mb="md">
        About
      </Title>
      <Text mb="md">
        Mantine provides a rich set of accessible React components that pair nicely with Vite&apos;s rapid
        development workflow. This starter illustrates how you can begin wiring Mantine into your own routes.
      </Text>
      <List spacing="sm">
        <List.Item>
          Explore the full component catalog at{' '}
          <Anchor href="https://mantine.dev/core/app-shell/" target="_blank" rel="noreferrer">
            mantine.dev
          </Anchor>
        </List.Item>
        <List.Item>Compose layouts quickly using the AppShell, Container, and Stack components.</List.Item>
        <List.Item>Adjust the color scheme in MantineProvider to match your product branding.</List.Item>
      </List>
    </Container>
  )
}

export default About
