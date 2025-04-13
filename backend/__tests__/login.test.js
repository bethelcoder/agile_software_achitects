const request = require('supertest')
const app = require("../../app");
const { authenticate, initialize } = require('passport');


jest.mock('passport', () => ({
    authenticate: jest.fn(() => (req, res, next) => next()),
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next()),
    use: jest.fn(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
}));


jest.mock('passport-google-oauth20', ()=>{
    const MockStrategy = function (){
        this.name = 'google';
    };

    MockStrategy.prototype.authenticate = function (){};
    return {Strategy: MockStrategy};
});

jest.mock('passport-github2', ()=>{
    const MockStrategy = function (){
        this.name = 'github';
    };

    MockStrategy.prototype.authenticate = function (){};
    return {Strategy: MockStrategy};
});

describe('GET /auth/login', () => {
    it("should render the sign in page", async () => {
        const res = await request(app).get('/auth/login');
        expect(res.statusCode).toBe(200);
    });
});
