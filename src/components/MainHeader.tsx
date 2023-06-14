import { Box, Burger, Container, Group, Header, MediaQuery, Paper, rem, Stack, ThemeIcon, Title, Transition, UnstyledButton, useMantineTheme } from '@mantine/core'
import { useHeadroom } from '@mantine/hooks'
import { IconX } from '@tabler/icons-react'
import { isValidElement, MutableRefObject, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { HEADER_HEIGHT } from '../utils/Constant'
import HeaderButtonLink from './_HeaderButtonLink'
import HeaderIconLink from './_HeaderIconLink'

interface MenuItem {
  label?: string
  to?: string
  href?: string,
  showOnMobileOnly?: boolean,
  showOnDesktopOnly?: boolean,
  element?: ReactNode
}

interface MenuIcon extends MenuItem {
  icon: React.ReactNode
  iconOnDesktopOnly: boolean
}

export default function MainHeader({ menu, ref }: { menu: (MenuItem | MenuIcon)[], ref?: MutableRefObject<any> }) {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  const pinned = useHeadroom({ fixedAt: 36 })

  return <Header height={HEADER_HEIGHT} sx={(theme) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000000,
    transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
    transition: 'transform 400ms ease'
  })}>
  <Container>
    <Group position="apart">
      <Stack h={HEADER_HEIGHT} justify="center">
        <UnstyledButton component={Link} to="/">
          <Title order={2}>Appledore Lab</Title>
        </UnstyledButton>
      </Stack>
      <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
        <Box>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
          <Transition mounted={opened} transition={{
            in: { opacity: 1, transform: 'scaleX(1)' },
            out: { opacity: 0, transform: 'scaleX(0)' },
            common: { transformOrigin: 'right' },
            transitionProperty: 'transform, opacity',
          }} duration={200} timingFunction="ease">
            {(styles) => <Paper
              shadow="md"
              pos="absolute"
              p="md"
              top={0}
              left={0}
              right={0}
              bottom={0}
              h="100vh"
              style={styles}>
              <Box pos="absolute" top={rem(16)} right={rem(33)}>
                <ThemeIcon variant="light" size={rem(42)} radius="xl" color="gray" onClick={() => setOpened(false)}>
                  <IconX size={rem(30)} />
                </ThemeIcon>
              </Box>
              <Stack h="100%" justify="center">
                {menu.filter(item => item.showOnMobileOnly || !item.showOnDesktopOnly).map((item, i) =>
                  item.element && isValidElement(item.element) ? item.element as ReactNode : <HeaderButtonLink
                  key={i}
                  onClick={() => setOpened(false)}
                  size="xl"
                  variant="subtle"
                  color="gray"
                  {...(item as MenuIcon).icon ? { leftIcon: (item as MenuIcon).icon } : {} }
                  {...item.href ? { href: item.href } : { to: item.to as string }}>
                  {item.label}
                </HeaderButtonLink>)}
              </Stack>
            </Paper>}
          </Transition>
        </Box>
      </MediaQuery>
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Group>
          {menu.filter(item => !item.showOnMobileOnly || item.showOnDesktopOnly).map((item, i) => {
            if (item.element && isValidElement(item.element)) {
              return item.element
            }
            return (item as MenuIcon).iconOnDesktopOnly ? <HeaderIconLink
              key={i}
              size="xl"
              {...item.href ? { href: item.href } : { to: item.to as string }}>
              {(item as MenuIcon).icon}
            </HeaderIconLink> : <HeaderButtonLink
              key={i}
              size="md"
              {...item.href ? { href: item.href } : { to: item.to as string }}>
              {item.label}
            </HeaderButtonLink>
          })}
        </Group>
      </MediaQuery>
    </Group>
  </Container>
</Header>
}