import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productsRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

// --- SWAGGER IMPORTS ---
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();
connectDB();

const app = express();

// --- SWAGGER CONFIGURATION ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Supermarket API',
            version: '1.0.0',
            description: 'API documentation for the Supermarket management system with image upload via Cloudinary',
            contact: {
                name: 'API Support',
                email: 'support@supermarket.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 4000}`,
                description: 'Local server',
            },
            {
                url: 'https://api.supermarket.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Save swagger.json file
try {
    fs.writeFileSync('./swagger.json', JSON.stringify(specs, null, 2));
    console.log('✅ swagger.json generated successfully');
} catch (err) {
    console.error('❌ Failed to generate swagger.json', err);
}

// UI Customization
const uiOptions = {
    customSiteTitle: "Supermarket API Docs",
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css',
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('uploads'));

// --- SWAGGER ROUTE ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, uiOptions));

// --- API ROUTES ---
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running', timestamp: new Date() });
});

// --- 404 HANDLER ---
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📖 Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;