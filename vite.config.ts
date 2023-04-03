import react from '@vitejs/plugin-react'
import hljs from 'highlight.js'
import { defineConfig } from 'vite'
import { Mode, plugin as mdPlugin } from 'vite-plugin-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdPlugin({
    mode: [Mode.HTML],
    markdownIt: {
      typographer: true,
      highlight: function (str: string, lang: string) {
        try {
          return `<pre class="hljs">${str
            .split('\n')
            .map(s => `${hljs.highlight(s, {
              language: lang, ignoreIllegals: true
            }).value}`)
            .join('<br />')}</pre>`
        } catch (error) {
          console.error(error)
        }

        return `<pre class="hljs">${str}</pre>`
      }
    }
  })],
})
