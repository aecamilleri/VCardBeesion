const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, phone, company, email, password } = req.body;
  try {
    const user = new User({ name, phone, company, email, password });
    await user.save();
    res.status(201).send('Usuario registrado con éxito');
  } catch (error) {
    res.status(400).send('Error al registrar usuario: ' + error.message);
  }
});

// Inicio de sesión de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).send('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Contraseña incorrecta');

  // Crear un token JWT para mantener la sesión activa
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
