var expect = require('expect');
var {generateMsg, generateLocationMsg} = require('./msg');

describe('generatreMsg',() => {
  it('should generate correct msg', () => {
    const from = 'Vader';
    const text = 'May the force be with you';
    let msg = generateMsg(from, text);
    expect(msg).toInclude({from, text});
    expect(msg.createdAt).toBeA('number');

  });

});


describe('generateLocationMsg', () => {

  it('should generate the correct location msg', () => {
    const from = 'User2';
    const coords = {latitude: 32, longitude: 69};
    let locationMsg = generateLocationMsg(from, coords);

    expect(locationMsg).toInclude({
      from,
      url: 'https://www.google.ca/maps?=32,69'
    });
    expect(locationMsg.createdAt).toBeA('number');

  });

});
