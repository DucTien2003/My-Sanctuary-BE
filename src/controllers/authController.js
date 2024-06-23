const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { isEmpty } = require('../utils');
const {
  createUser,
  getUserByEmail,
  getUserByUsername,
  updateResetCodeByEmail,
  updatePasswordByResetCode,
} = require('../services/userServices.js');

const handleLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    let user = await getUserByUsername(username);

    if (isEmpty(user)) {
      user = await getUserByEmail(username);
    }

    if (isEmpty(user)) {
      return res.status(401).json({
        message: 'Username or email is incorrect.',
        unauthenticated: 'username',
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Password is incorrect.',
          unauthenticated: 'password',
        });
      }

      const token = jwt.sign(
        { username: user.username, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.json({ token });
    }
  } catch (error) {
    console.log('Error: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const handleRegister = async (req, res, next) => {
  const { username, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  Promise.all([getUserByUsername(username), getUserByEmail(email)])
    .then((values) => {
      if (!isEmpty(values[0])) {
        return res.status(409).json({
          message: 'Username already exists.',
          conflict: 'username',
        });
      } else if (!isEmpty(values[1])) {
        return res.status(409).json({
          message: 'Email already exists.',
          conflict: 'email',
        });
      } else {
        Promise.all([createUser(username, hashedPassword, email)])
          .then(() => {
            return res
              .status(200)
              .json({ message: 'User created successfully.' });
          })
          .catch((error) => {
            console.log('Error: ', error);
            return res.status(500).json({});
          });
      }
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json({});
    });
};

const handleForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const userInfo = await getUserByEmail(email);

  if (isEmpty(userInfo)) {
    return res
      .status(400)
      .json({ message: 'Email is incorrect.', unauthenticated: 'email' });
  }

  const verificationCode = crypto.randomBytes(4).toString('hex');
  const resetCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const result = await updateResetCodeByEmail(
    email,
    verificationCode,
    resetCodeExpires
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: 'Password Reset Verification Code',
    text: `Your verification code is ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.json({ success: false, message: 'Error sending email' });
    } else {
      return res.json({ success: true, message: 'Verification code sent' });
    }
  });
};

const handleResetPassword = async (req, res, next) => {
  const { verificationCode, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await updatePasswordByResetCode(
      verificationCode,
      hashedPassword
    );

    if (result.success) {
      return res.json({
        success: true,
        message: 'Reset password successfully.',
      });
    } else {
      return res.status(401).json({
        message: result.message,
        unauthenticated: 'code',
      });
    }
  } catch (error) {
    console.log('Error: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleResetPassword,
  handleForgotPassword,
};
