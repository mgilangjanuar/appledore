import { MDAttribute } from '@/vite'
import { Avatar, Col, Container, Grid, Group, Image, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../_NotFound'

import 'highlight.js/styles/github-dark.css'

export default function Post() {
  const params = useParams()
  const [notFound, setNotFound] = useState<boolean>(false)
  const [content, setContent] = useState<{
    html: string,
    attributes: MDAttribute
  }>()

  useEffect(() => {
    if (params.path) {
      import(`../../assets/contents/${params.path}.md`)
        .then(val => {
          setContent(val)
        })
        .catch(() => setNotFound(true))
    }
  }, [params.path])

  return notFound ? <NotFound /> : <Container pb="xl">
    <Title fw="normal">{content?.attributes.title}</Title>

    {content?.attributes.image ? <Image src={content?.attributes.image} mt="lg" /> : <></>}

    <Grid mt="md">
      <Col span={12} md={10}>
        <Group spacing="sm">
          <Group spacing="xs">
            <Text size="lg">{dayjs(content?.attributes.published_at).format('MMMM D, YYYY')}</Text>
            <Text size="lg">&bull;</Text>
            <Text size="lg">{content?.attributes.reading_time}</Text>
          </Group>
          {content?.attributes.tags?.length ? <Group spacing="xs">
            <Text size="lg">&bull;</Text>
            {content?.attributes.tags?.map(tag => <Text size="lg" key={tag}>{tag}</Text>)}
          </Group> : <></>}
        </Group>

        <Text size="lg" className="rendered-md" dangerouslySetInnerHTML={{ __html: content?.html || '' }} />

        <Text color="dimmed" component="em" mt="md" size="lg">Written by,</Text>
        <UnstyledButton component="a" href="https://twitter.com/mgilangjanuar" target="_blank">
          <Group mt="md" spacing="lg">
            <Avatar src="https://pbs.twimg.com/profile_images/1604785576695107584/IdOV4ohX_400x400.jpg" size="lg" radius="xl" />
            <Stack spacing={0}>
              <Text size="xl" component="strong">M Gilang Januar</Text>
              <Text size="lg" color="dimmed">@mgilangjanuar</Text>
            </Stack>
          </Group>
        </UnstyledButton>
      </Col>
    </Grid>

  </Container>
}