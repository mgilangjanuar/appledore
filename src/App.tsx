import { Box, Divider, MantineProvider, rem } from '@mantine/core'
import { IconBrandGithub, IconBrandTwitter } from '@tabler/icons-react'
import { Analytics } from '@vercel/analytics/react'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import MainHeader from './components/MainHeader'
import Home from './pages/Home'
import Initiatives from './pages/Initiatives'
import Links from './pages/Links'
import Writings from './pages/Writings'
import Post from './pages/Writings/Post'
import NotFound from './pages/_NotFound'
import { HEADER_HEIGHT } from './utils/Constant'

import './App.css'

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return <MantineProvider withGlobalStyles withNormalizeCSS>
    {/* <MainHeader menu={[
    {
      label: 'Home',
      to: '/',
      showOnMobileOnly: true,
    },
    // {
    //   label: 'Initiatives',
    //   to: '/initiatives'
    // },
    {
      label: 'Writings',
      to: '/writings'
    },
    // {
    //   label: 'Links',
    //   to: '/links'
    // },
    {
      showOnMobileOnly: true,
      element: <Divider orientation="horizontal" key="divider" size="xs" my="xl" /> },
    {
      showOnDesktopOnly: true,
      element: <Divider orientation="vertical" key="divider" size="xs" mx="xl" /> },
    {
      label: '@mgilangjanuar\'s Repos',
      icon: <IconBrandGithub size={21} />,
      href: 'https://github.com/mgilangjanuar',
      iconOnDesktopOnly: true
    },
    {
      label: '@mgilangjanuar\'s Tweets',
      icon: <IconBrandTwitter size={21} />,
      href: 'https://twitter.com/mgilangjanuar',
      iconOnDesktopOnly: true
    }
  ]} /> */}
    <Box py={rem(20)} mt={HEADER_HEIGHT} mih={`calc(100vh - ${HEADER_HEIGHT})`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/initiatives" element={<Initiatives />} />
        <Route path="/writings" element={<Writings />} />
        <Route path="/writings/:path" element={<Post />} />
        <Route path="/links" element={<Links />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
    <Analytics />
  </MantineProvider>
}

export default App
