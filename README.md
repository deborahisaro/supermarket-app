# Supermarket App — Products CRUD

A full-stack supermarket product management app built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS.

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose, Multer
- Frontend: HTML, Tailwind CSS, Vanilla JavaScript

## Setup Instructions

### 1. Clone the repo
git clone YOUR_GITHUB_LINK_HERE

### 2. Install dependencies
npm install

### 3. Configure .env
Create a `.env` file in the root folder and add:
PORT=4000
MONGO_URI=mongodb://localhost:27017/simba
JWT_SECRET=your_secret_key

### 4. Start the server
node index.js

### 5. Open the frontend
Open `index.html` in your browser

## API Endpoints
- GET /api/products — Get all products
- GET /api/products/:id — Get single product
- POST /api/products — Create product (multipart/form-data)
- PUT /api/products/:id — Update product (multipart/form-data)
- DELETE /api/products/:id — Delete product

## Figma Design
(https://www.figma.com/design/JSLl3LWeYKA6XRvXiFtcxk/Untitled?node-id=0-1&t=X0hGlskEP0MQouue-1)