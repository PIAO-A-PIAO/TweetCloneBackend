const request = require('supertest');
import app from '../index.js';
require('@babel/register');

describe('Sign up', () => {
    it('should throw 400 if password is invalid', async () => {
        try{
            const result = await request(app).post('/api/auths/signup').send({
                username: "Holly",
                email: "holly@dm.com",
                password: "pw"
        });
    } catch(err){
        expect(err.response.status).toBe(400);
    }
    })

    it('should return 200 if credentials are valid', async () => {
        const result = await request(app).post('/api/auths/signup').send({
            username: 'Holly',
            email: 'holly@dm.com',
            password: 'password'
        });
        expect(result.status).toBe(200);
        expect(result.body.username).toBe('Holly');
    })

    it('should throw 400 if user already exists', async () => {
        try{
            const result = await request(app).post('/api/auths/signup').send({
            username: 'Holly',
            email: 'holly@dm.com',
            password: 'password'
        });
    } catch(err){
        expect(err.response.status).toBe(400);
    }
    })
});

describe('Sign in', () => {
    it('should throw 404 if user is not found', async () => {
        try {
            const result = await request(app).post('/api/auths/signin').send({
                email: 'jammy@dm.com',
                password: 'password'
            })
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    })

    it ('should throw 401 if password is incorrect', async () => {
        try {
            const result = await request(app).post('/api/auths/signin').send({
                email: 'holly@dm.com',
                password: 'wrongpassword'
            })
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    })

    it ('should return 200 if credentials are valid', async () => {
        const result = await request(app).post('/api/auths/signin').send({
            email: 'holly@dm.com',
            password: 'password'
        });
        expect(result.status).toBe(200);
        expect(result.body.user.username).toBe('Holly');
    })
})


describe('Cancel Account', () => {
    it('should successfully cancel account', async () => {
        const authResponse = await request(app).post('/api/auths/signin').send({
            email: "holly@dm.com",
            password: "password"
        });
        const body = JSON.parse(authResponse.text);
        const token = body.token;

        const result = await request(app).delete('/api/auths/').set('Cookie', "access_token="+token);
        expect(result.status).toBe(200);
    })
});
  