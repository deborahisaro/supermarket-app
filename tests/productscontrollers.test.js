import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productsControllers.js';
import Product from '../models/product.js';
import cloudinary from '../config/cloudinary.js';

jest.mock('../models/product.js');
jest.mock('../config/cloudinary.js');

describe('Products Controllers', () => {
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [
                { _id: '1', name: 'Apple', price: 4.99, category: 'Produce' },
                { _id: '2', name: 'Milk', price: 3.99, category: 'Dairy' }
            ];
            Product.find.mockResolvedValue(mockProducts);

            const mockReq = { query: {} };

            await getAllProducts(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
        });

        it('should filter products by category', async () => {
            const mockProducts = [
                { _id: '1', name: 'Apple', price: 4.99, category: 'Produce' }
            ];
            Product.find.mockResolvedValue(mockProducts);

            const mockReq = { query: { category: 'Produce' } };

            await getAllProducts(mockReq, mockRes);

            expect(Product.find).toHaveBeenCalledWith({ category: 'Produce' });
        });
    });

    describe('getProductById', () => {
        it('should return a product by ID', async () => {
            const mockProduct = { _id: '1', name: 'Apple', price: 4.99 };
            Product.findById.mockResolvedValue(mockProduct);

            const mockReq = { params: { id: '1' } };

            await getProductById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
        });

        it('should return 404 if product not found', async () => {
            Product.findById.mockResolvedValue(null);

            const mockReq = { params: { id: 'invalid' } };

            await getProductById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createProduct', () => {
        it('should create a product with image', async () => {
            cloudinary.uploader.upload.mockResolvedValue({
                secure_url: 'https://example.com/image.jpg',
                public_id: 'public_id_123'
            });

            const mockProduct = {
                _id: '1',
                name: 'Apple',
                price: 4.99,
                category: 'Produce',
                image: 'https://example.com/image.jpg',
                cloudinaryPublicId: 'public_id_123'
            };
            Product.create.mockResolvedValue(mockProduct);

            const mockReq = {
                body: { name: 'Apple', price: 4.99, category: 'Produce' },
                file: { path: '/tmp/image.jpg' }
            };

            await createProduct(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
        });

        it('should return 400 if required fields missing', async () => {
            const mockReq = { body: { name: 'Apple' }, file: null };

            await createProduct(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const oldProduct = {
                _id: '1',
                name: 'Apple',
                price: 4.99,
                cloudinaryPublicId: 'old_id'
            };
            Product.findById.mockResolvedValue(oldProduct);

            const updatedProduct = {
                _id: '1',
                name: 'Red Apple',
                price: 5.99
            };
            Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

            const mockReq = {
                params: { id: '1' },
                body: { name: 'Red Apple', price: 5.99 },
                file: null
            };

            await updateProduct(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(updatedProduct);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            const mockProduct = {
                _id: '1',
                name: 'Apple',
                cloudinaryPublicId: 'public_id_123'
            };
            Product.findById.mockResolvedValue(mockProduct);
            cloudinary.uploader.destroy.mockResolvedValue({});
            Product.findByIdAndDelete.mockResolvedValue(mockProduct);

            const mockReq = { params: { id: '1' } };

            await deleteProduct(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Product deleted successfully'
            });
        });

        it('should return 404 if product not found', async () => {
            Product.findById.mockResolvedValue(null);

            const mockReq = { params: { id: 'invalid' } };

            await deleteProduct(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });
});