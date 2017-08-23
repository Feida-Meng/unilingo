var expect = require('expect');
var {generateMsg} = require('./msg');

describe('generatreMsg',() => {
  it('should generate correct msg', () => {
    const from = 'Vader';
    const text = 'May the force be with you';
    let msg = generateMsg(from, text);
    expect(msg).toInclude({from, text});
    expect(msg.createdAt).toBeA('number');

  });

});
