
class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {id, name, room}
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id );
    }
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0]
  }

  getUserList(room) {
    let users = this.users.filter((user) => user.room === room );
    // let names = users.map((user) => user.name );
    return users;
  }
}

module.exports = { Users };
