import { register, login } from '../controllers/authControllers.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('../models/user.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controllers', () => {
    const mockReq = {
        body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user',
            age: 28
        }
    };

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword123');
            const mockUser = { _id: '123', ...mockReq.body };
            User.create.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('token123');

            await register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                user: mockUser,
                token: 'token123'
            });
        });

        it('should return 400 if user already exists', async () => {
            User.findOne.mockResolvedValue({ email: 'john@example.com' });

            await register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'User already exists'
            });
        });
    });

    describe('login', () => {
        it('should login a user successfully', async () => {
            const mockUser = { _id: '123', email: 'john@example.com', password: 'hashedPassword' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token123');

            const loginReq = { body: { email: 'john@example.com', password: 'password123' } };

            await login(loginReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                user: mockUser,
                token: 'token123'
            });
        });

        it('should return 401 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const loginReq = { body: { email: 'john@example.com', password: 'password123' } };

            await login(loginReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Invalid credentials'
            });
        });

        it('should return 401 if password is incorrect', async () => {
            const mockUser = { _id: '123', email: 'john@example.com', password: 'hashedPassword' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const loginReq = { body: { email: 'john@example.com', password: 'wrongpassword' } };

            await login(loginReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Invalid credentials'
            });
        });
    });
});