// vars of encryptions
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const user = require("../models/user");
// Models
const User = require("../models/user");
// others
const fs = require("fs");
const path = require("path");

// async functions of this controller

function signUp(req, res) {
  // new User constant
  const user = new User();
  // destructuring of the req (Certificate SignIn Request)
  const { email, password, repeatPassword } = req.body;
  // set user props
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;

  // data validation
  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Passwords are required" });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Passwords are not the same" });
    } else {
      // successfull passwords, ready to encrypt
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res.status(500).send({ message: "Password encryption error" });
          console.log(err);
        } else {
          user.password = hash;
          //res.status(200).send({ message: "success", passwordUser: hash });

          // user saved in the database
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "User already exist", err: err });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Failed to create user" });
              } else {
                res.status(200).send({
                  status: 200,
                  message: "User created successfully",
                  user: userStored,
                });
              }
            }
          });
        }
      });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error of server" });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "User not found" });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error of server" });
          } else if (!check) {
            res.status(404).send({ message: "Passoword incorrect" });
          } else {
            if (!userStored.active) {
              res
                .status(200)
                .send({ status: 200, message: "User not actived" });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().then(users => {
    if (!users) {
      res.status(404).send({ message: "Not found any user" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function getUsersActive(req, res) {
  // console.log(req);
  const query = req.query;

  User.find({ active: query.active }).then(users => {
    if (!users) {
      res.status(404).send({ message: "Not found any user" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Server error" });
    } else {
      if (!userData) {
        res.status(404).send({ message: "Not found any user" });
      } else {
        let user = userData;

        if (req.files) {
          let filePath = req.files.avatar.path;
          let fileSplit = filePath.split("/");
          let fileName = fileSplit[2];

          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(200).send({ message: "The extension not valid (Extensions allowed: .png and .jpg)" });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate({ _id: params.id }, user, (err, userResult) => {
              if (err) {
                res.status(500).send({ message: "Server error" });
              } else {
                if (!userResult) {
                  res.status(404).send({ message: "Not found any user" });
                } else {
                  res.status(200).send({ avatarName: fileName });
                }
              }
            });
          }
        }
      }
    }
  })
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  fs.open(filePath, (err, exist) => {
    if (err) {
      res.status(500).send({ message: "The avatar you search not exist" });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

async function updateUser(req, res) {
  var userData = req.body;
  userData.email = req.body.email.toLowerCase();
  const params = req.params;

  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error of encrypted" });
      } else {
        userData.password = hash;
      }
    });
  }

  User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
    if (err) {
      res.status(500).send({ message: "Server error" });
    } else {
      if (!userUpdate) {
        res.status(404).send({ message: "Not found any user" });
      } else {
        res.status(200).send({ message: "User update successfully" });
      }
    }
  });
}

function activateUser(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  User.findByIdAndUpdate(id, { active }, (err, userStore) => {
    if (err) {
      res.status(500).send({ message: "Server error" });
    } else {
      if (!userStore) {
        res.status(404).send({ message: "User not exist" });
      } else {
        if (active === true) {
          res.status(200).send({ message: "User active successfully" });
        } else {
          res.status(200).send({ message: "User desactive successfully" })
        }
      }
    }
  });
}

function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndRemove(id, (err, userDelete) => {
    if (err) {
      res.status(500).send({ message: "Server error" });
    } else {
      if (!userDelete) {
        res.status(404).send({ message: "User not exist" });
      } else {
        res.status(200).send({ message: "User deleted successfully" });
      }
    }
  });
}

function signUpAdmin(req, res) {
  const user = new User();
  const { name, lastname, email, role, password } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = role;
  user.active = true;

  if (!password) {
    res.status(500).send({ message: "Passoword is required" });
  } else {
    bcrypt.hash(password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error of encrypted the password" });
      } else {
        user.password = hash;
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: "User all ready exist" });
          } else {
            if (!userStored) {
              res.status(500).send({ message: "Error created new user" });
            } else {
              res.status(200).send({ message: "User created successfully" });
            }
          }
        });
      }
    });
  }
}

// export functions
module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
  signUpAdmin,
};
