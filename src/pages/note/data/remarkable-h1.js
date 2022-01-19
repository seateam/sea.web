import $store from '../../../assets/js/vuex'
// 任务
const parseH1 = (state) => {
  const blockTokens = state.tokens
  for (let i = 0; i < blockTokens.length; i++) {
    const tokens = blockTokens[i]
    if (tokens.type === 'heading_close') {
      const tokens2 = blockTokens[i - 1]
      const hash = $store.state.mdToc.findIndex((e) => {
        return e.includes(tokens2.content)
      })
      tokens2.children.unshift(
        {
          type: 'htmltag',
          content: `<a name="${hash}">`,
          level: 0,
        },
        {
          type: 'htmltag',
          content: '</a> ',
          level: 0,
        },
      )
    }
  }
}

const h1 = function (md) {
  md.core.ruler.push('h1', parseH1)
}
h1.format = function (e) {
  // 四空格的代码块
  if (e.startsWith('    ')) {
    return ''
  }
  // 首尾空格
  e = e.trim()
  // 表格
  if (e.startsWith('|')) {
    return ''
  }
  // 代码块
  if (e.startsWith('`')) {
    return ''
  }
  // <xxx>
  e = e.replace(/<.+?>/g, '')
  // (xxx)
  e = e.replace(/\(.+?\)/g, '')
  // **xxx**
  e = e.replace(/\*\*(.+?)\*\*/g, '$1')
  // [xxx]
  e = e.replace(/\[(.+?)\]/g, '$1')
  return e
}
export default h1
