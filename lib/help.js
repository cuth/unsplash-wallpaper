const { optionsArr } = require('./args');
const { cyan, magenta, yellow } = require('./colors');

module.exports = optionsArr
  .map(
    ([key, { alias, param, desc }]) => `
  ${alias ? yellow(`-${alias}, `) : ''}${yellow(`--${key}`)} ${
      param
        ? `{${
            Array.isArray(param)
              ? param.map(p => magenta(p)).join(',')
              : magenta(param)
          }}`
        : ''
    }${
      desc
        ? desc
            .map(
              i =>
                i.charAt(0) === ' '
                  ? cyan(`
    $ unsplash-wallpaper${i}`)
                  : `
    ${i}`
            )
            .join('')
        : ''
    }
`
  )
  .join('');
