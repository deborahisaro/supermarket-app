import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userControllers.js';
import User from '../models/user.js';

jest.mock('../models/user.js');

describe('User Controllers', () => {
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { _id: '1', name: 'John', email: 'john@example.com' },
                { _id: '2', name: 'Jane', email: 'jane@example.com' }
            ];
            User.find.mockResolvedValue(mockUsers);

            const mockReq = {};

            await getAllUsers(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should handle errors', async () => {
            User.find.mockRejectedValue(new Error('Database error'));

            const mockReq = {};

            await getAllUsers(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            const mockUser = { _id: '1', name: 'John', email: 'john@example.com' };
            User.findById.mockResolvedValue(mockUser);

            const mockReq = { params: { id: '1' } };

            await getUserById(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if user not found', async () => {
            User.findById.mockResolvedValue(null);

            const mockReq = { params: { id: 'invalid' } };

            await getUserById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const mockUser = { _id: '1', name: 'John', email: 'john@example.com', save: jest.fn() };
            mockUser.save.mockResolvedValue(undefined);
            User.mockImplementation(() => mockUser);

            const mockReq = { body: { name: 'John', email: 'john@example.com' } };

            await createUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockUser);
        });

        it('should handle validation errors', async () => {
            const mockUser = { save: jest.fn().mockRejectedValue(new Error('Validation error')) };
            User.mockImplementation(() => mockUser);

            const mockReq = { body: { name: 'John' } };

            await createUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            const updatedUser = { _id: '1', name: 'Updated John', email: 'john@example.com' };
            User.findByIdAndUpdate.mockResolvedValue(updatedUser);

            const mockReq = { params: { id: '1' }, body: { name: 'Updated John' } };

            await updateUser(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return 404 if user not found', async () => {
            User.findByIdAndUpdate.mockResolvedValue(null);

            const mockReq = { params: { id: 'invalid' }, body: { name: 'Updated' } };

            await updateUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const deletedUser = { _id: '1', name: 'John', email: 'john@example.com' };
            User.findByIdAndDelete.mockResolvedValue(deletedUser);

            const mockReq = { params: { id: '1' } };

            await deleteUser(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });

        it('should return 404 if user not found', async () => {
            User.findByIdAndDelete.mockResolvedValue(null);

            const mockReq = { params: { id: 'invalid' } };

            await deleteUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });
});