const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.config");
const db = require("../mysql-orm/connection");

const Users = db.user;

const signUp = async (req, res) => {
  const salt = await bcrypt.genSalt();
  try {
    const user = await Users.create({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      name: req.body.name,
      surname: req.body.surname,
      birth: req.body.birth,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      state: req.body.state,
      postalCode: req.body.postalCode
    });
    const token = createJWToken(user.id);
    console.log(token);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
      name: user.name,
      surname: user.surname,
      birth: user.birth,
      address: user.address,
      city: user.city,
      country: user.country,
      state: user.state,
      postalCode: user.postalCode
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const createJWToken = id => {
  return jwt.sign({ id }, authConfig.secret, {
    expiresIn: 10800 //3h
  });
};

const logIn = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      return res.status(404).send({ msg: "No user found." });
    } else {
      const authUser = await bcrypt.compare(req.body.password, user.password);
      if (!authUser) {
        res
          .status(401)
          .send({ accessToken: null, message: "Invalid password" });
      }
      const token = createJWToken(user.id);
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

module.exports = {
  signUp,
  logIn
};
