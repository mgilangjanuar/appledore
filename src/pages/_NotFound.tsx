import { Col, Container, Grid, Image, Stack, Text, Title } from '@mantine/core'

export default function NotFound() {
  return <Container>
    <Stack align="center">
      <Image maw="440px" src="https://media.tenor.com/yheo1GGu3FwAAAAC/rick-roll-rick-ashley.gif" alt="Rick Roll" />
      <Grid ta="center">
        <Col span={12} md={8} offsetMd={2}>
          <Title order={2}>404 Not Found</Title>
          <Text color="dimmed" mt="sm">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            Meanwhile, you may listen to this GIF.
          </Text>
        </Col>
      </Grid>
    </Stack>
  </Container>
}