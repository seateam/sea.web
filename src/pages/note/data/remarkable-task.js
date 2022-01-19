// 任务
const parseTask = (state) => {
  const blockTokens = state.tokens
  for (let i = 0; i < blockTokens.length; i++) {
    const tokens = blockTokens[i]
    if (tokens.type === 'inline') {
      for (let i2 = 0; i2 < tokens.children.length; i2++) {
        let children
        const token = tokens.children[i2]
        let level = token.level
        if (token.type === 'text') {
          let text = token.content
          if (text.startsWith('[x] ')) {
            text = text.replace('[x] ', '')
            children = [
              {
                type: 'htmltag',
                content: '<i class="fas fa-check-circle">',
                level: level,
              },
              {
                type: 'htmltag',
                content: '</i> ',
                level: level,
              },
              // { type: 'em_open', level: level },
              { type: 'del_open', level: level },
              { type: 'text', content: text, level: level++ },
              { type: 'del_close', level: level },
              // { type: 'em_close', level: level },
            ]
            tokens.children.splice(i2, 1, ...children)
          } else if (text.startsWith('[ ] ')) {
            text = text.replace('[ ] ', '')
            children = [
              {
                type: 'htmltag',
                content: '<i class="fas fa-circle-notch">',
                level: level,
              },
              {
                type: 'htmltag',
                content: '</i> ',
                level: level,
              },
              { type: 'text', content: text, level: level++ },
            ]
            tokens.children.splice(i2, 1, ...children)
          }
        }
      }
    }
  }
}

const task = function (md) {
  md.core.ruler.push('task', parseTask)
}
export default task
