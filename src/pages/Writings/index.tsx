import { Container, Image, Text, Title } from '@mantine/core'
import parseMD from 'parse-md'
import { useEffect, useState } from 'react'

export default function Writings() {
  const [contents, setContents] = useState<string[]>()

  useEffect(() => {
    fetch('/_contents/index.md')
      .then(res => res.text())
      .then(md => {
        const { metadata } = parseMD(md)
        setContents((metadata as { articles: string[] }).articles)
      })
      .catch(console.error)
  }, [])

  return <Container>
    {/* <Title mb="lg">Writings</Title> */}
    <Image mt="xl" maw="440px" src="https://media.tenor.com/yheo1GGu3FwAAAAC/rick-roll-rick-ashley.gif" alt="Rick Roll" />
    <Title mt="sm" order={2}>Coming Soon</Title>
    <Text mt="sm" color="dimmed">
      The page is under construction.
    </Text>
    {/* {contents?.map(content => <Paper
      key={content}
      shadow="xs"
      p="lg"
      mb="xs"
      component={Link}
      to={`/writings${content.replace(/\.md$/i, '')}`}>
      {content}
    </Paper>)} */}
  </Container>
}