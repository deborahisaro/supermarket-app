import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    const mockNext = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('protect middleware', () => {
        it('should call next if token is valid', () => {
            const mockDecoded = { id: '123' };
            jwt.verify.mockReturnValue(mockDecoded);

            const mockReq = {
                headers: {
                    authorization: 'Bearer valid_token_123'
                }
            };

            protect(mockReq, mockRes, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith('valid_token_123', expect.any(String));
            expect(mockReq.user).toEqual(mockDecoded);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 401 if no token provided', () => {
            const mockReq = { headers: {} };

            protect(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'No token, unauthorized'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 if token is invalid', () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            const mockReq = {
                headers: {
                    authorization: 'Bearer invalid_token'
                }
            };

            protect(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});