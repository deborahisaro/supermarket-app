import Product from '../models/product.js';
import cloudinary from '../config/cloudinary.js';

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

        let image = '';
        let cloudinaryPublicId = '';

        // Handle Cloudinary image upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'supermarket/products',
                resource_type: 'auto',
            });
            image = result.secure_url;
            cloudinaryPublicId = result.public_id;
        }

        const product = await Product.create({
            name,
            price,
            category,
            description,
            stock,
            image,
            cloudinaryPublicId,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let image = product.image;
        let cloudinaryPublicId = product.cloudinaryPublicId;

        // Handle Cloudinary image update
        if (req.file) {
            // Delete old image from Cloudinary
            if (cloudinaryPublicId) {
                await cloudinary.uploader.destroy(cloudinaryPublicId);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'supermarket/products',
                resource_type: 'auto',
            });
            image = result.secure_url;
            cloudinaryPublicId = result.public_id;
        }

        const updatedData = {
            ...req.body,
            image,
            cloudinaryPublicId,
        };

        const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete image from Cloudinary
        if (product.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(product.cloudinaryPublicId);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};