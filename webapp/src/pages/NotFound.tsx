import { Button, Container, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Container size="sm">
      <Stack gap="md" align="center" ta="center">
        <Title order={2}>Page Not Found</Title>
        <Text c="dimmed">The page you requested could not be located.</Text>
        <Button component={Link} to="/" variant="light">
          Return to home
        </Button>
      </Stack>
    </Container>
  )
}

export default NotFound
