const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');  // Importamos bcryptjs

const app = express();

// Configuración para permitir CORS
app.use(cors());

// Middleware para parsear cuerpos JSON
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://aecamilleri_db:<PKCj4KFijHLpYfu2>@cluster0.w7pnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.log('❌ Error de conexión:', err));

// Definir un modelo de usuario (schema)
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

// Ruta para registrar un usuario
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el usuario', error: err });
    }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            // Comparamos la contraseña ingresada con la almacenada
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.status(200).json({ message: 'Usuario autenticado', user });
            } else {
                res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error de servidor', error: err });
    }
});

// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
