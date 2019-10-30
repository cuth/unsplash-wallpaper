module.exports = {
  options: {
    type: 'object',
    properties: {
      width: {
        type: 'number'
      },
      height: {
        type: 'number'
      },
      dir: {
        type: 'string',
        default: '.'
      }
    }
  }
};
