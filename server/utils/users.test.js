const expect = require('expect');
const { Users } = require('./users');
describe('Users', () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'u1',
      room: 'space'
    }, {
      id: 2,
      name: 'u2',
      room: 'space'
    }, {
      id: 3,
      name: 'u3',
      room: 'space2'
    }]
  });

  it('should add a new user', () => {
    const group1 = new Users();
    group1.addUser(users.users[0].id,users.users[0].name,users.users[0].room);
    expect(group1.users[0]).toEqual(users.users[0]);

  });

  it('should return all users in the room', () => {
    const names = users.getUserList('space');
    expect(names).toEqual([users.users[0].name,users.users[1].name]);
  });

  it('should return the user matching the id', () => {
    const user = users.getUser(3);
    expect(user).toEqual(users.users[2]);
  });

  it("should not return any name if user does'nt exist", () => {
    const name = users.getUser(99);
    expect(name).toNotExist();
  });

  it('should remove the user', () => {
    users.removeUser(2);
    expect(users.getUser(2)).toNotExist();
    expect(users.users.length).toBe(2);
  })

});
