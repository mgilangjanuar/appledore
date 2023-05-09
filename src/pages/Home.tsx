import { Anchor, Box, Button, Col, Collapse, Container, Divider, Grid, Image, MediaQuery, Paper, Text, Title } from '@mantine/core'
import { useDisclosure, useToggle } from '@mantine/hooks'
import { IconMail } from '@tabler/icons-react'
import { useEffect } from 'react'
import Avatar from '../assets/Avatar'

export default function Home() {
  const [animate, setAnimate] = useToggle(['', 'active'])
  const [openedEmail, { toggle: toggleEmail }] = useDisclosure(false)

  useEffect(() => {
    setAnimate()
  }, [])

  return <Container fluid>
    <Grid>
      <Col span={12} lg={10} offsetLg={1}>
        <Grid align="flex-start" gutter="xl">
          <Col span={12} md={4} ta="center">
            <Grid align="center" pt="sm">
              <Col span={12} xs={6} md={12}>
                <Avatar style={{ width: '100%' }} className={animate} />
              </Col>
              <Col span={12} xs={6} md={12}>
                <Box>
                  <Anchor component="a" href="https://github.com/mgilangjanuar" target="_blank">
                    <Image mx="auto" src="https://github-readme-stats.vercel.app/api?username=mgilangjanuar&count_private=true&include_all_commits=true&show_icons=true&theme=default" alt="GitHub Stats" />
                  </Anchor>
                </Box>
                <Box mt="xs">
                  <Anchor component="a" href="https://wakatime.com/@mgilangjanuar" target="_blank">
                    <Image mx="auto" src="https://github-readme-stats.vercel.app/api/wakatime?username=mgilangjanuar" alt="WakaTime Stats" />
                  </Anchor>
                </Box>
                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                  <Box mt="xs">
                    <Anchor component="a" href="https://github.com/mgilangjanuar" target="_blank">
                      <Image mx="auto" src="https://github-readme-stats.vercel.app/api/top-langs/?username=mgilangjanuar&layout=compact&langs_count=10" alt="Top Languages" />
                    </Anchor>
                  </Box>
                </MediaQuery>
              </Col>
            </Grid>
          </Col>
          <Col span={12} md={8}>
            <Title fw="normal">
              Welcome to @mgilangjanuar&apos;s lab!
            </Title>
            <Text mt="lg" size="lg">
              M Gilang Januar is a software architecture development and NLP/NLU enthusiast based in Jakarta, Indonesia. He is
              currently the VP of Engineering at <Anchor component="a" href="https://bahasa.ai" target="_blank">
                Bahasa.ai</Anchor> and a Business Principal at <Anchor component="a" href="https://automa.site" target="_blank">
                Automa</Anchor>. He has a Bachelor's degree in Computer Science from the University of Indonesia and has worked
              as a software engineer, back-end engineer, and teaching assistant in the past. He is skilled in REST APIs, JavaScript,
              and web development, among other skills. M Gilang Januar is also involved in various open-source projects and has
              developed several projects, such as <Anchor component="a" href="https://github.com/mgilangjanuar/gptcommit" target="_blank">
                gptcommit</Anchor>, <Anchor component="a" href="https://repl-ai.com" target="_blank">
                ReplAI</Anchor>, <Anchor component="a" href="https://github.com/mgilangjanuar/teledrive" target="_blank">
                TeleDrive</Anchor>, and <Anchor component="a" href="https://restfire.appledore.dev" target="_blank">RestFire</Anchor>.
            </Text>
            <Divider my="lg" label="Highlight Repos" labelProps={{ color: 'dimmed' }} />
            <Grid gutter="xs">
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/automaapp/automa" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=automaapp&repo=automa" alt="TeleDrive" />
                </Anchor>
              </Col>
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/mgilangjanuar/teledrive" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=mgilangjanuar&repo=teledrive" alt="TeleDrive" />
                </Anchor>
              </Col>
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/mgilangjanuar/satpam" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=mgilangjanuar&repo=satpam" alt="satpam" />
                </Anchor>
              </Col>
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/mgilangjanuar/gptcommit" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=mgilangjanuar&repo=gptcommit" alt="gptcommit" />
                </Anchor>
              </Col>
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/mgilangjanuar/restfire" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=mgilangjanuar&repo=restfire" alt="RestFire" />
                </Anchor>
              </Col>
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/mgilangjanuar/repair-json" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=mgilangjanuar&repo=repair-json" alt="Repair JSON" />
                </Anchor>
              </Col>
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/mgilangjanuar/chat-wa" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=mgilangjanuar&repo=chat-wa" alt="Chat WA" />
                </Anchor>
              </Col>
              <Col span={12} xs={9} sm={6} md={9} lg={9} xl={6}>
                <Anchor component="a" href="https://github.com/mgilangjanuar/progamer" target="_blank">
                  <Image src="https://github-readme-stats.vercel.app/api/pin/?username=mgilangjanuar&repo=progamer" alt="ProGamer" />
                </Anchor>
              </Col>
            </Grid>
            <Divider my="md" label="Contact" labelProps={{ color: 'dimmed' }} />
            <Paper p="xl" withBorder ta="center">
              <Button
                size="lg"
                component="a"
                href="mailto:mgilangjanuar@appledore.dev"
                target="_blank"
                variant="subtle"
                color="blue"
                radius="sm"
                leftIcon={<IconMail size={18} />}>
                mgilangjanuar@appledore.dev
              </Button>
              <Text my="xs" color="dimmed" size="xs">
                <Anchor onClick={toggleEmail} color="dimmed" style={{ fontStyle: 'italic' }}>why email?</Anchor>
              </Text>
              <Collapse in={openedEmail}>
                <Anchor component="a" href="https://twitter.com/_workchronicles/status/1637841075233603587" target="_blank">
                  <Image mx="auto" maw={420} src="https://pbs.twimg.com/media/FrrHx05XsAEQuDJ?format=png&name=900x900" alt="Twitter" />
                </Anchor>
              </Collapse>
            </Paper>
          </Col>
        </Grid>
      </Col>
    </Grid>
  </Container>
}
