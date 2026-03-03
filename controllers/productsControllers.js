import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

export const getAllProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, price, category, description, stock } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price and category are required' });
        }
        const image = req.file ? req.file.filename : '';
        const product = await Product.create({ name, price, category, description, stock, image });
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // If a new image is uploaded, delete the old one
        if (req.file && product.image) {
            const oldPath = path.join('uploads', product.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const updatedData = {
            ...req.body,
            image: req.file ? req.file.filename : product.image
        };

        const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete image file from uploads folder
        if (product.image) {
            const imagePath = path.join('uploads', product.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};