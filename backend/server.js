const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const db = require('./database'); 
const authRoutes = require('./routes/authR');
const carRoutes = require('./routes/carR');
const partRoutes = require('./routes/partR'); 

const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use(cors()); 

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Garage Tuning Tracker API',
        version: '1.0.0',
        description: 'SAD Course Project - Web-based CRUD Application API Documentation [cite: 4, 43]',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/api/auth/register': {
            post: {
                summary: 'Register a new user',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string' } } } } }
                },
                responses: { 201: { description: 'Successful' }, 400: { description: 'Taken' } }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'Login user',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string' } } } } }
                },
                responses: { 200: { description: 'Successful' }, 401: { description: 'Wrong password' } }
            }
        },
        '/api/cars': {
            post: {
                summary: 'Add a vehicle [cite: 32]',
                tags: ['Cars'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['brand', 'model', 'year'], properties: { brand: { type: 'string' }, model: { type: 'string' }, year: { type: 'integer' } } } } }
                },
                responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' } }
            },
            get: {
                summary: 'Get user\'s vehicles [cite: 32]',
                tags: ['Cars'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Success' } }
            }
        },
        '/api/cars/{id}': {
            put: {
                summary: 'Update a vehicle [cite: 32]',
                tags: ['Cars'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', properties: { brand: { type: 'string' }, model: { type: 'string' }, year: { type: 'integer' } } } } }
                },
                responses: { 200: { description: 'Updated' }, 44: { description: 'Not Found' } }
            },
            delete: {
                summary: 'Delete a vehicle [cite: 32]',
                tags: ['Cars'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Deleted' } }
            }
        },
        '/api/parts': {
            post: {
                summary: 'Add modification part [cite: 61]',
                tags: ['Parts'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['car_id', 'part_name', 'cost'], properties: { car_id: { type: 'integer' }, part_name: { type: 'string' }, cost: { type: 'number' }, installed_date: { type: 'string' } } } } }
                },
                responses: { 201: { description: 'Created' } }
            }
        },
        '/api/parts/{carId}': {
            get: {
                summary: 'Get parts of a vehicle [cite: 61]',
                tags: ['Parts'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'carId', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Success' } }
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotalar
app.use('/api/auth', authRoutes); 
app.use('/api/cars', carRoutes); 
app.use('/api/parts', partRoutes);

app.get('/', (req, res) => {
    res.send('Garage Tuning Tracker API is running! Check /api-docs');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});