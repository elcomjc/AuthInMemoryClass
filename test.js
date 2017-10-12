'use strict';

class Auth {
  constructor(hash) {
    this.sessions = [];
    this.users = [];
    this.passwords = [];
    Object.keys(hash).map(k => ({k, v: hash[k]})).map(e => {
      this.users.push(e.k);
      this.passwords.push(e.v);
    });
  }

  logout(user) {
    if(user) {
      const userIndex = this.idx(user, this.sessions);
      if(userIndex > -1) {
        this.sessions.splice(userIndex, 1);
      }
    }
  }

  // Register user
  registerUser(user, password) {
    if(user && !this.userExists(user)) {
      this.users.push(user);
      this.passwords.push(password);
    } else {
      console.log('Error: El usuario que intenta registrar ya existe en el sistema.');
    }
  }

  removeUser(user) {
    if(user) {
      const userIndex = this.idx(user, this.users);
      if(userIndex > -1) {
        this.users.splice(userIndex, 1);
        this.passwords.splice(userIndex, 1);
      }
    }
  }

  updatePassword(user, oldPassword, newPassword) {
    // First we check if the user exists
    let passwordChanged = false;
    if(user && oldPassword && newPassword) {
      if(this.userExists(user)){
        if (this.checkPassword(user, oldPassword)) {
          setUserPassword(user, newPassword);
          passwordChanged = true;
        }
      }
    }
    return passwordChanged;
  }

  login(user, password) {
    if(user && password && this.userExists(user) && 
      this.checkPassword(user, password) && !userIsAlreadyLoggedIn(user)){
      this.sessions.push(user);
    }
  }

  // Checks if user exists
  userExists(user) {
    return (this.idx(user, this.users) > -1);
  }

  getUserPassword(user) {
    const userIndex = this.idx(user, this.users);
    return this.passwords[userIndex];
  }

  setUserPassword(user, password) {
    const userIndex = this.idx(user, this.users);
    this.passwords[userIndex] = password;
  }

  userIsAlreadyLoggedIn(user) {
    return (this.sessions.indexOf(user) > -1);
  }

  checkPassword(user, password) {
    return this.getUserPassword(user) === password;
  }

  // Gets index of an element in an array
  idx(element, array) {
    return array.indexOf(element);
  }
}

const registeredUsers = {
  user1: 'pass1',
  user2: 'pass2',
  user3: 'pass3'
};

const auth = new Auth(registeredUsers);

auth.registerUser('user4', 'pass4');
auth.login('user4', 'pass4');
auth.updatePassword('user3', 'pass3', 'pass5');
auth.login('user3', 'pass5');
auth.logout('user4');
auth.logout('user3');