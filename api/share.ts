import { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync } from 'fs'
import parseMD from 'parse-md'
import { resolve } from 'path'

export default async function (req: VercelRequest, res: VercelResponse) {
  const { r } = req.query
  const origin = `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
  const raw = readFileSync(resolve('src', 'assets', 'contents', `${r}.md`), 'utf-8')
  const data = parseMD(raw)
  if (data) {
    const path = `/writings/${r}`
    const title = (data.metadata as { title: string }).title
    const description = (data.metadata as { excerpt: string }).excerpt
    const imgUrl = origin + (data.metadata as { image: string }).image
    const date = (data.metadata as { published_at: string }).published_at

    const str = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="${origin}/favicon.ico" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${description}" />
    <meta name="author" content="M Gilang Januar">
    <meta name="article:author" content="M Gilang Januar">
    <meta name="article:published_time" content="${date}">
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imgUrl}" />
    <meta property="og:url" content="${origin}${path}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imgUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="@mgilangjanuar" />
    <link rel="apple-touch-icon" href="${origin}/logo192.png" />
    <meta http-equiv="refresh" content=".1;url=${origin}${path}" />
  </head>
  <body>Please wait...</body>
  </html>`
    res.setHeader('Content-Type', 'text/html')
    res.write(str)
    res.end()
    return
  }
  return res.send('Not found')
}