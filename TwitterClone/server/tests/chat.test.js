const request = require('supertest');
import app from '../index.js';
require('@babel/register');

describe('Create Chat', () => {
    it('should return 403 when trying to chat with yourself', async () => {
        try{
            const jim = await request(app).post('/api/auths/signin').send({
            email: "jim@dm.com", 
            password: "password"
        });
        const token = jim._body.token;
        const userId = jim._body.user._id;

        const result = await request(app).post('/api/chats/'+userId).set('Cookie', `access_token=${token}`);
    }catch(err){
        expect(err.status).toBe(403);
    }
    })

    it('should return 403 when chat already exists', async () => {
        try {
                const jim = await request(app).post('/api/auths/signin').send({
                email: "jim@dm.com", 
                password: "password"
            });
            const token = jim._body.token;

            const result = await request(app).post('/api/chats/643612c565b61eee2dee777b').set('Cookie', `access_token=${token}`);
        } catch (error) {
            expect(error.status).toBe(403);
        }
    })

    it('should return 200 when chat is created', async () => {
        const jim = await request(app).post('/api/auths/signin').send({
            email: "jim@dm.com", 
            password: "password"
        });
        const token = jim._body.token;

        const result = await request(app).post('/api/chats/64360534d37bbb197bd84c6c').set('Cookie', `access_token=${token}`);
        expect(result.status).toBe(200);
    })
})

describe('Delete Chat', () => {
    it('should return 200 when chat is deleted', async () => {
        const jim = await request(app).post('/api/auths/signin').send({
            email: "jim@dm.com", 
            password: "password"
        });
        const chats = jim._body.user.chats;
        const latest = chats[chats.length - 1];
        const token = jim._body.token;

        const result = await request(app).delete('/api/chats/'+latest).set('Cookie', `access_token=${token}`);
        expect(result.status).toBe(200);
    })
})

describe('Send Message', () => {
    it('should return 200 and send message', async () => {
        const jim = await request(app).post('/api/auths/signin').send({
            email: "jim@dm.com", 
            password: "password"
        });
        const token = jim._body.token;

        const result = await request(app).post('/api/chats/6436185d94929e8de77ac00e/message').set('Cookie', `access_token=${token}`).send({
            text: "Hello Pam!"
        })
        expect(result.status).toBe(200);
    })
})