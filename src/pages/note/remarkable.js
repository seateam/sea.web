// markdown
import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/linkify'
import task from './remarkable-task.js'
import h1 from './remarkable-h1.js'
import hljs from 'highlight.js'
export default {
  data() {
    return {
      remarkable: null,
    }
  },
  methods: {
    initHtml(md) {
      if (md) {
        return this.remarkable.render(md)
      } else {
        return ''
      }
    },
    initRemarkable() {
      // https://github.com/jonschlinkert/remarkable
      const remarkable = new Remarkable('full', {
        html: true, // Enable HTML tags in source
        xhtmlOut: true, // Use '/' to close single tags (<br />)
        breaks: true, // Convert '\n' in paragraphs into <br>
        // CSS language prefix for fenced blocks
        langPrefix: 'language-',
        // 链接 target 属性
        linkTarget: '_blank',
        // Enable some language-neutral replacements + quotes beautification
        typographer: true,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
        quotes: '“”‘’',
        // Highlighter function. Should return escaped HTML,
        // or '' if input not changed
        highlight(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value
            } catch (__) {}
          }

          try {
            return hljs.highlightAuto(str).value
          } catch (__) {}

          return '' // use external default escaping
        },
      })
      // Autoconvert URL-like text to links
      remarkable.use(linkify)
      remarkable.use(task)
      remarkable.use(h1)
      remarkable.core.ruler.enable(['abbr'])
      remarkable.block.ruler.enable(['footnote', 'deflist'])
      remarkable.inline.ruler.enable(['footnote_inline', 'ins', 'mark', 'sub', 'sup'])
      this.remarkable = remarkable
    },
    bindEmoji() {
      window.open('/emoji')
    },
  },
}
