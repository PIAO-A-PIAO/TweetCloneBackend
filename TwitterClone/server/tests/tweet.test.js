const request = require('supertest');
import app from '../index.js';
require('@babel/register');

describe('read Tweet', () => {
    it('should return 404 when tweet not found', async () => {
        try{
            const result = await request(app).put('/api/tweets/123123');
        } catch(error) {
            expect(error.status).toBe(404);
        }
    });

    it('should return 200 and read a tweet', async () => {
        const result = await request(app).get('/api/tweets/64360539d37bbb197bd84c6f');
        expect(result.status).toBe(200);
        expect(result.body.text).toBe("I am Michael!");
    })
})

describe('create Tweet', () => {
    it('should return 200 and create a new tweet', async () => {
        const authResponse = await request(app).post('/api/auths/signin').send({
            email: "michael@dm.com",
            password: "password"
        });
        const body = JSON.parse(authResponse.text);
        const token = body.token;

        const response = await request(app)
        .post('/api/tweets/')
        .set('Cookie', 'access_token=' + token)
        .send({text: "test tweet"});

        expect(response.status).toBe(200);
    })
});

describe('delete Tweet', () => {
    it('should return 401 when trying to delete other\'s tweet', async () => {
        try{
            const michael = await request(app).post('/api/auths/signin').send({
            email: "michael@dm.com", 
            password: "password"
        });
        const token = michael._body.token;

        const result = await request(app).delete('/api/tweets/6436067e1733351fc2348510').set('Cookie', 'access_token=' + token);
    }catch(error) {
        expect(result.status).toBe(401);
    }
    })

    it('should return 200 and delete a tweet', async () => {
        const michael = await request(app).post('/api/auths/signin').send({
            email: "michael@dm.com", 
            password: "password"
        });
        const tweets = michael._body.user.tweets;
        const latest = tweets[tweets.length - 1];
        const token = michael._body.token;

        const result = await request(app).delete('/api/tweets/'+latest).set('Cookie', 'access_token=' + token);
        expect(result.status).toBe(200);
    })
});

describe('update Tweet', () => {
    it('should return 404 when tweet not found', async () => {
        try{
            const result = await request(app).put('/api/tweets/643612c565b61eee2dee7765').send({text: "new tweet"});
        } catch(error) {
            expect(error.status).toBe(404);
        }
    });

    it('should return 401 when trying to update other user\'s tweet', async () => {
        try {
            const result = await request(app).put('/api/tweets/6436067e1733351fc2348510').send({text: "new tweet"});
        } catch (error) {
            expect(error.status).toBe(401);
        }
    });

    it('should return 200 and update a tweet', async () => {
        const jim = await request(app).post('/api/auths/signin').send({
            email: "jim@dm.com", 
            password: "password"
        });
        const token = jim._body.token;

        const tweet = await request(app).get('/api/tweets/6436067e1733351fc2348510');
        const result = await request(app).put('/api/tweets/6436067e1733351fc2348510').send({text: "I am Jim Halpert!"}).set('Cookie', 'access_token=' + token);
        await request(app).put('/api/tweets/6436067e1733351fc2348510').send({text: "I am Jim!"}).set('Cookie', 'access_token=' + token);
        
        expect(result.status).toBe(200);
        expect(tweet.body.text).toBe("I am Jim!");
        expect(result.body.text).toBe("I am Jim Halpert!");
    })
});

describe('like/unlike Tweet', () => {
    it('should return 200 when like a tweet', async () => {
        const jim = await request(app).post('/api/auths/signin').send({
            email: "jim@dm.com", 
            password: "password"
        });
        const token = jim._body.token;

        const liked = await request(app).put('/api/tweets/64361c015d644791de400003/like').set('Cookie', 'access_token=' + token);
        const unliked = await request(app).put('/api/tweets/64361c015d644791de400003/like').set('Cookie', 'access_token=' + token);
        expect(liked.status).toBe(200);
        expect(liked.body).toBe("tweet liked");
        expect(unliked.status).toBe(200);
        expect(unliked.body).toBe("tweet unliked");
    })
})
