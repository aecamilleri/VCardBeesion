const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://aecamilleri_db:<PKCj4KFijHLpYfu2>@cluster0.w7pnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  // URL de tu MongoDB Atlas
const dbName = 'tu_base_de_datos';

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body); // Los datos del formulario que envías desde el frontend
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Por favor, completa todos los campos.' }),
            };
        }

        // Conexión con MongoDB
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection('users');
            await collection.insertOne({ name, email, password });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Usuario registrado con éxito.' }),
            };
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error de servidor, intente más tarde.' }),
            };
        } finally {
            await client.close();
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método no permitido.' }),
        };
    }
};
