const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()

//api/auth/register
router.post(
  '/register',
  [
    check('email', 'Email wrong').isEmail(),
    check(
      'password',
      'Minimum length of password should be at least 6 symbols'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Some values are incorrect during registration',
        })
      }
      const { email, password } = req.body
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res
          .status(400)
          .json({ message: `Email ${email} has already existed` })
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })
      await user.save()

      res.status(201).json({ message: `User created` })
    } catch (e) {
      res.status(500).json({ message: 'Something haeppened wrong, try again' })
    }
  }
)

//api/auth/login
router.post(
  '/login',
  [
    check('email', 'Insert correct email').normalizeEmail().isEmail(),
    check('password', 'Insert password').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Some values are incorrect at login',
        })
      }

      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: `User didn't find` })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: `Password uncorrect, try again` })
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      })

      res.json({ token, userId: user.id })
    } catch (e) {
      res.status(500).json({ message: 'Something haeppened wrong, try again' })
    }
  }
)

module.exports = router
