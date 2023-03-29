import { Container } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../_NotFound'

export default function Post() {
  const params = useParams()
  const [notFound, setNotFound] = useState<boolean>(false)
  const [content, setContent] = useState<string>()

  useEffect(() => {
    if (params.path) {
      fetch(`/_contents/${params.path}.md`)
        .then(res => {
          if (!res.ok) {
            throw new Error(res.statusText)
          }
          return res.text()
        })
        .then(setContent)
        .catch(() => setNotFound(true))
    }
  }, [params.path])

  return notFound ? <NotFound /> : <Container>
    {content}
  </Container>
}