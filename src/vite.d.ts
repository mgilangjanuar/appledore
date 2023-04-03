declare module '*.md' {
  const attributes: MDAttribute

  const html: string

  export { attributes, html }
}

export type MDAttribute = {
  title: string,
  published_at: string,
  excerpt: string,
  language: 'en' | 'id',
  image?: string,
  reading_time: string,
  tags: string[]
}