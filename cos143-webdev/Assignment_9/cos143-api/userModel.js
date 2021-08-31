const md5 = require('md5');

class UserModel {
  constructor() {
    this._sessionId = null
  }

  get username() {
    return this._username
  }

  set username(value) {
    if (value !== null && value !== undefined) {
      if (value.length < 4 || value.length > 6) {
        throw Error("Invalid length.")
      }

      this._username = value
    } else {
      throw Error("Missing param.")
    }
  }

  get password() {
    return this._password
  }

  set password(value) {
    if (value !== null && value !== undefined) {
      if (value.length < 4 || value.length > 6) {
        throw Error("Invalid length.")
      }

      this._password = md5(value)
    } else {
      throw Error("Missing param.")
    }
  }

  get sessionId() {
    return this._sessionId
  }

  set sessionId(value) {
    if (value !== undefined && value !== "") {
      this._sessionId = value
    }
  }

  static strToHash(password) {
    return md5(password)
  }

  toJSON() {
    return {
      username: this.username,
      password: this.password
    }
  }

  fromJSON(obj) {
    if (obj) {
      this.username = obj.username
      this.password = obj.password
    }

    return this
  }
}

module.exports = UserModel