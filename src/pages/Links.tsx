import { Container, Image, Text, Title } from '@mantine/core'

export default function Links() {
  return <Container>
    <Image mt="xl" maw="440px" src="https://media.tenor.com/yheo1GGu3FwAAAAC/rick-roll-rick-ashley.gif" alt="Rick Roll" />
    <Title mt="sm" order={2}>Coming Soon</Title>
    <Text mt="sm" color="dimmed">
      The page is under construction.
    </Text>
  </Container>
}