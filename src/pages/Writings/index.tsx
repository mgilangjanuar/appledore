import { MDAttribute } from '@/vite'
import { Avatar, Box, Col, Container, Divider, Grid, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ content }: { content: MDAttribute & { path: string } }) => <Paper
  key={content.path}
  shadow="xs"
  mb="xs"
  component={Link}
  to={
    `/writings/${content.path
      .split('/')
      .at(-1)
      ?.replace(/\.md$/i, '')}`
  }>
  {content.image ? <Image src={content.image} /> : <></>}
  <Box p="lg">
    <Title fw="normal">{content.title}</Title>
    <Group mt="xs" spacing="sm">
      <Group spacing="xs">
        <Text size="lg">{dayjs(content.published_at).format('MMMM D, YYYY')}</Text>
        <Text size="lg">&bull;</Text>
        <Text size="lg">{content.reading_time}</Text>
      </Group>
      {content.tags?.length ? <Group spacing="xs">
        <Text size="lg">&bull;</Text>
        {content.tags?.map(tag => <Text size="lg" key={tag}>{tag}</Text>)}
      </Group> : <></>}
    </Group>
    <Text size="lg" mt="xs">{content.excerpt}</Text>
    <Group mt="md" spacing="lg">
      <Avatar src="https://pbs.twimg.com/profile_images/1604785576695107584/IdOV4ohX_400x400.jpg" size="lg" radius="xl" />
      <Stack spacing={0}>
        <Text size="xl" component="strong">M Gilang Januar</Text>
        <Text size="lg" color="dimmed">@mgilangjanuar</Text>
      </Stack>
    </Group>
  </Box>
</Paper>

export default function Writings() {
  const [contents, setContents] = useState<(MDAttribute & { path: string })[]>([])

  useEffect(() => {
    const files = import.meta.glob('../../assets/contents/*.md')
    Object.keys(files).reverse().reduce(async (res, f) => {
      const { attributes } = await files[f]() as { attributes: MDAttribute }
      return [...await res, { ...attributes, path: f }]
    }, Promise.resolve([] as (MDAttribute & { path: string })[]))
    .then(setContents)
  }, [])

  return <Container fluid>
    <Grid>
      <Col span={12} md={10} offsetMd={1} lg={8} offsetLg={2}>
        <Group mb="xl" align="end">
          <Title>Writings</Title>
          <Divider orientation="vertical" />
          <Text size="lg" color="dimmed">
            I write about things I learn, things I do, and things I think about.
          </Text>
        </Group>
        {contents?.[0] ? <PostCard content={contents?.[0]} /> : <></>}
        <Grid mt="xl">
          {contents?.slice(1).map(content => <Col span={12} md={6} key={content.path}>
            <PostCard content={content} />
          </Col>)}
        </Grid>
      </Col>
    </Grid>
  </Container>
}